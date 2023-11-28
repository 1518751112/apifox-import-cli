// 获取当前命令行 后面的参数
import axios from 'axios'

export interface ConfigInfo {
    //apifox的token
    token: string;
    //项目id
    projectID: string;
    //需要导入的接口配置
    urls:{
        //swagger的json数据地址
        url:string,
        //指定目录
        dir:string
    }[]
    enableLog?: boolean;
}
export class Tool {

    options: ConfigInfo;
    constructor(options:ConfigInfo) {
        this.options = options;
    }

    async start() {
        if(!this.options){
            this.log('配置文件不存在')
            return
        }
        this.log('---IMPORT START---')
        const {urls,token,projectID} = this.options;
        if(!urls||!token||!projectID){
            this.log('参数缺失')
        }
        const urlregex = new RegExp("^(http|https|ftp)\://[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(:[a-zA-Z0-9]*)?/?([a-zA-Z0-9\-\._\?\,\'/\\\+&amp;%\$#\=~])*$");
        if(Array.isArray(urls)){
            for (let i = 0; i < urls.length; i++) {
                const temp = urls[i]
                if(urlregex.test(temp.url)){
                    try {
                        const {data} = await axios.get('http://127.0.0.1:15030/doc/client-json')
                        if(temp.dir){
                            //处理文件目录
                            const paths = Object.keys(data.paths)
                            paths.forEach(path=>{
                                const temp = data.paths[path]
                                const method = Object.keys(temp)
                                method.forEach(m=>{
                                    temp[m]['x-apifox-folder'] = temp.dir+'/'+temp[m].tags[0]
                                })
                            })
                        }
                        const body:any = {
                            importFormat:"openapi",
                            data,
                            apiOverwriteMode:'merge',
                            schemaOverwriteMode:'merge',
                            syncApiFolder:true
                        }


                        const result = await axios.post(`https://api.apifox.cn/api/v1/projects/${projectID}/import-data`,body,{
                            headers:{
                                Authorization:'Bearer '+token,
                                "X-Apifox-Version":'2022-11-16'
                            }
                        })

                        this.log(i+1,temp.dir||'',temp.url,'success')
                    }catch (e) {
                        this.log(i+1,temp.dir||'',temp.url,'fail')
                    }

                }
            }
        }
        this.log(`---IMPORT END---`)
    }

    log(...rest) {
        console.log.apply(this, rest)
    }

}

