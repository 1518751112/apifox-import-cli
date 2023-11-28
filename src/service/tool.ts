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
        if(Array.isArray(urls)){
            for (let i = 0; i < urls.length; i++) {
                const {url,dir} = urls[i]
                if(url){
                    try {
                        const {data} = await axios.get(url)
                        if(dir){
                            //处理文件目录
                            const paths = Object.keys(data.paths)
                            paths.forEach(path=>{
                                const temp = data.paths[path]
                                const method = Object.keys(temp)
                                method.forEach(m=>{
                                    if(temp[m].tags)
                                        temp[m]['x-apifox-folder'] = dir+'/'+temp[m].tags[0]
                                    else{
                                        temp[m]['x-apifox-folder'] = dir
                                    }
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

                        this.log(i+1,dir||'',url,'success')
                    }catch (e) {
                        this.log(i+1,dir||'',url,e.message)
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

