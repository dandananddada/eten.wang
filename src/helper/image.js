export const aliyun = (year, name) => {
    const encodeName = encodeURIComponent(name)
    return `https://eten-wang.oss-cn-beijing.aliyuncs.com/games/${year}/${encodeName}.jpg?x-oss-process=style/game.eten.wang`
}