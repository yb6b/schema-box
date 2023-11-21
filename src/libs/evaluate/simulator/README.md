# 赛码器
模拟使用某方案跟打某篇文章。
## 基本流程
1. 把方案转成字典树数据结构
2. 使用字典树，把文章切分成一段段的文章片段
3. 根据切分的结果，统计基本的数据：码长统计、按键统计……
4. 根据上条的基本数据，统计完整的赛码成绩

## 赛码器的结果
一个对象，都是单数单词：
### 字符
- lack          缺字的总数
- lackHanzi     缺少的汉字的集合
- hanzi         上屏的汉字总数
- commit        上屏的总次数

### 打词
- word          打词的总次数
- wordChar      打词的总汉字数
- wordDist      各长度的词语的次数，例：索引0表示上屏单字的次数

### 选重
非首选的选重
- collision     选重的次数
- collisionChar 选重的字数
- collisionDist 选重频数分布，例：索引0表示首选上屏的次数，索引1表示二选上屏的次数

### 码长
- codeLen       上屏的编码的总长，考虑选重键
- codeLenDist   上屏的编码的长度的频数分布，例：索引0表示码长为1的词条的数量

### 单键手感
- key           全部的击键数量
- keyDist       各按键的频数分布，例：索引q表示 Q键按了多少次
- fingerDist    各手指的使用次数分布，例：索引0表示大拇指用了多少次。[手指索引号](../README.md)
- kbdRowDist    键盘上每一行的使用次数分布，例：索引0表示数字一行的使用次数

### 组合击键的手感
- combo         按键组合的总数
- Eq            总当量, 未收录的组合的当量视为1.5
- trible        三连击
- double        二连击
- singleSpan    小跨排
- multiSpan     大跨排
- longFD        错手 long fingers disturb
- littleFD      小指干扰
- sameFinger    同指组合
- diffFinger    异指组合
- LeftToRight   先左手再右手
- LeftToLeft    先左手再左手
- RightToRight  先右手再右手
- RightToLeft   先右手再右手


