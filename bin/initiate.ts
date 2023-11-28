#!/usr/bin/env node
import {Tool,ConfigInfo} from "../src/index";
import * as yamljs from 'yamljs'
const [configFile] = process.argv.slice(2)
import {join} from 'path'

//配置文件
const options = yamljs.load(join(process.cwd(), configFile || 'apifox_import.yml')) as ConfigInfo
// console.log(options)
const tool = new Tool(options)
tool.start()
