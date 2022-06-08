react-three 模版

### Contents ###

上线地址：
测试地址：

### Usage ###

#### 1、运行命令

`npm i`：安装依赖

`npm run dev`: 开发模式

`npm run qn`： 生成可部署至七牛的代码包

`npm run handover`：生成可交接的代码包，并生成zip包，需提前在zip命令中修改正确路径和包名称

## 压缩draco模型
gltf-pipeline -i in.glb -o out.glb -b -d --draco.compressLevel 4 --draco.quantizePositionBits 14

## 压缩basis贴图(根目录basisu文件夹执行，图片放imgs下)
for file in imgs/*.png
do                              
 ./basisu $file -comp_level 5 -max_endpoints 16128 -max_selectors 16128 -no_selector_rdo -no_endpoint_rdo
done
