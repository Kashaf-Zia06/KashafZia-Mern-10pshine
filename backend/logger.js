import pino from "pino";

const logger=pino({
    transport:{

        target:"pino-pretty",
        options:{
            colorsize:true,
            translateTime:"SYS:standard",
            ignore:"pid,hostname"
        }

    }

})

export default logger
