/*
 * Copyright (c) 2020 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * Version: 5.0.0.300
 * Description: wearEngine SDK
 */
var P2pClient = (function () {
    var peerPkgName;
    var peerFingerPrint;

    function P2pClient(context) {}
    /**
     * 设置手机应用的packageName
     * peerPkgName: string
     */
    P2pClient.prototype.setPeerPkgName = function (peerPkgName) {
        if (!peerPkgName) {
            return;
        }
        this.peerPkgName = peerPkgName;
    };
    /**
     * 设置手机侧指纹信息
     * fingerPrint: string
     */
    P2pClient.prototype.setPeerFingerPrint = function (fingerPrint) {
        if (!fingerPrint) {
            return;
        }
        this.peerFingerPrint = fingerPrint;
    };
    /**
     * 检测对端设备侧是否已经安装指定应用
     * pingCallback: object:onSuccess(),onFailure(),onPingResult(resultCode)
     */
    P2pClient.prototype.ping = function (pingCallback) {
        var successCode = {
            data: "ERROR_CODE_P2P_PHONE_APP_EXIT",
            code: 205
        }
        var successCallBack = function () {
            pingCallback.onSuccess();
            pingCallback.onPingResult(successCode);
        };
        var notInstallCode = {
            data: "ERROR_CODE_P2P_PHONE_APP_NOT_EXIT",
            code: 204
        }
        var failCode = {
            data: "ERROR_CODE_P2P_OTHER_ERROR",
            code: 203
        }
        var failCallBack = function (data, code) {
            if (!data && !code) {
                pingCallback.onFailure();
                pingCallback.onPingResult(notInstallCode);
            } else {
                pingCallback.onFailure();
                pingCallback.onPingResult(failCode);
            }
        };
        console.log(this.peerPkgName);
        FeatureAbility.detect({
            bundleName: this.peerPkgName,
            success: successCallBack,
            fail: failCallBack,
        });
    };
    /**
     * 注册消息监听接口
     * receiver：object:onSuccess(),onFailure(),onReceiveMessage(message)
     */
    P2pClient.prototype.registerReceiver = function (receiver) {
        if (!receiver) {
            return;
        }
        var successCallBack = function (data) {
            receiver.onSuccess();
            receiver.onReceiveMessage(data.message);
        };
        FeatureAbility.subscribeMsg({
            success: successCallBack,
            fail: receiver.onFailure
        });
    };
    /**
     * 发送消息接口
     * message: Message
     * sendCallback: object:onSuccess(),onFailure(),onSendResult(resultCode),onSendProgress(count)
     * resultCode: SUCCESS 207, FAILURE 206
     */
    P2pClient.prototype.send = function (message, sendCallback) {
        if (!message || !sendCallback) {
            return;
        }
        var successCallBack = function () {
            var successCode = {
                data: "ERROR_CODE_COMM_SUCCESS",
                code: 207
            }
            sendCallback.onSuccess();
            sendCallback.onSendResult(successCode);
            sendCallback.onSendProgress(100)
        };

        var failCallBack = function (errorMessage, code) {
            var failCode = {
                data: errorMessage,
                code: 206
            }
            sendCallback.onFailure();
            sendCallback.onSendResult(failCode);
            sendCallback.onSendProgress(0)
        };
        FeatureAbility.sendMsg({
            deviceId: "remote",
            bundleName: this.peerPkgName,
            abilityName: "",
            message: message.getData(),
            success: successCallBack,
            fail: failCallBack,
        });
    };
    /**
     * 注销监听接口
     * receiver: onSuccess()
     */
    P2pClient.prototype.unregisterReceiver = function (receiver) {
        FeatureAbility.unsubscribeMsg();
        receiver.onSuccess();
    };
    return P2pClient;
}());
/**
 * 文件格式
 * name: file name with path
 * mode: 'text' or 'binary'
 * mode2: 'R', 'W', 'RW'
 */
var File = (function () {
    var name;
    var mode;
    var mode2;

    function File() {}
}());
var Builder = (function () {
    var messageInfo;

    function Builder(context) {}

    Builder.prototype.setDescription = function (description) {
        this.messageInfo = description;
        this.messageType = 0;
    };
    /**
     * 设置messge信息（两种格式任选其一）
     * data: ArrayBuffer
     * data: File（暂时不支持）
     */
    Builder.prototype.setPayload = function (data) {
        if (!data) {
            return;
        }
        if (data instanceof ArrayBuffer) {
            this.messageType = 0;
            return this.setBufferPlayload(data);
        } else if (data instanceof File) {
            this.messageType = 1;
            return this.setFilePlayload(data);
        }
    };
    Builder.prototype.setBufferPlayload = function (data) {
        this.messageInfo = String.fromCharCode.apply(null, new Uint16Array(data));
    };
    Builder.prototype.setFilePlayload = function (data) {
        this.messageInfo = JSON.stringify(data);
    };
    return Builder;
}());
var Message = (function () {
    var builder = new Builder();

    function Message(context) {}
    Message.prototype.describeContents = function () {
        return this.builder.messageInfo;
    };
    /**
     * 获取传送时的信息
     */
    Message.prototype.getData = function () {
        return this.builder.messageInfo;
    };
    Message.prototype.getDescription = function () {
        return this.builder.messageInfo;
    };
    /**
     * 获取文件信息
     */
    Message.prototype.getFile = function () {
        if (this.builder.messageType == 1) {
            return JSON.parse(this.builder.messageInfo);
        }
        return null;
    };
    /**
     * 获取传输数据类型
     * 0  string
     * 1  File
     */
    Message.prototype.getType = function () {
        return this.builder.messageType;
    };
    return Message;
}());

export {
    P2pClient,
    Message,
    Builder
};