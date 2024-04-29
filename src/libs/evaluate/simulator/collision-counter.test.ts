import { CollisionCounter, getJisuCollision } from './collision-counter'

/*
describe('',() => {
    it('',() => {

    })
})
*/

describe('计数器', () => {
  it('空编码返回0', () => {
    const c = new CollisionCounter()
    expect(c.get('x')).toBe(0)
  })

  it('加词/删词', () => {
    const c = new CollisionCounter()
    expect(c.add('a')).toBe(1)
    expect(c.add('a')).toBe(2)
    c.delete('a')
    expect(c.get('a')).toBe(1)
    c.delete('a')
    expect(c.get('a')).toBe(0)
    c.delete('a')
    expect(c.get('a')).toBe(0)
  })

  it('最大值', () => {
    const c = new CollisionCounter()
    c.add('a')
    expect(c.max).toBe(1)
    c.add('b')
    expect(c.max).toBe(1)
    c.add('a')
    expect(c.max).toBe(2)
    c.delete('a')
    expect(c.max).toBe(1)
    c.delete('b')
    expect(c.max).toBe(1)
    c.delete('a')
    expect(c.max).toBe(0)
  })
})

describe('极速赛码表的重码', () => {
  it('正常解析', () => {
    expect(getJisuCollision('').collision).toBe(1)
    expect(getJisuCollision('234').collision).toBe(234)
    expect(getJisuCollision('aaa234').collision).toBe(234)
    expect(getJisuCollision('aaa2_').collision).toBe(1)
  })
})
