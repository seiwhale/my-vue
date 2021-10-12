export default class Dep {
  constructor() {
    // 存放所有的 Watcher
    this.subs = {}
  }

  addSub(sub) {
    this.subs[sub.uid] = sub
  }

  notify() {
    for (const uid in this.subs) {
      this.subs[uid].update()
    }
  }
}