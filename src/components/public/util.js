import i18n from "@/i18n";
import {message as $message} from "ant-design-vue";

var util = {
    SUCCESS : "success",
    catchErr : function (res){
        console.log(res);
        this.error("err.systemErr");
    },
    error : function (message){
        $message.error(i18n.t(message));
    },
}

export default util;