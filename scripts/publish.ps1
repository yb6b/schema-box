bump patch
$v = gc .\package.json -Encoding UTF8 | ConvertFrom-Json
$vs = $v.version
Write-Host "推送远程"
pnpm build:cdn
mv ./dist/spa/index.html ./public/index.html -Force
git add .
git commit -m "release version $vs"
git push
nrm use npm
npm publish
Write-Host "打包本地文件"
pnpm build
7z a -t7z ".\dist\schema-box-$vs.7z" .\dist\spa\* -mmt -mx=9 -r