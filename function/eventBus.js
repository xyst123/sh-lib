class EventBus {
  constructor(vue) {
    if (!this.handlers) {
      Object.defineProperty(this, 'handlers', {
        value: {},
        enumerable: false,
      });
      this.Vue = vue;
      this.uidEvents = {};
    }
  }

  setUidEvents(uid, eventName) {
    if (!this.uidEvents[uid]) {
      this.uidEvents[uid] = [];
    }
    this.uidEvents[uid].push(eventName);
  }

  $offVmEvent(uid) {
    const events = this.uidEvents[uid] || [];
    // 解除当前vm实例监听的所有事件
    events.forEach((event) => {
      this.$off(event);
    });
  }

  $on(eventName, callback, vm) {
    if (!this.handlers[eventName]) {
      this.handlers[eventName] = [];
    }
    this.handlers[eventName].push(callback);
    if (vm instanceof this.Vue) {
      // 将监听的事件记录到vm实例的id上
      this.setUidEvents(vm._uid, eventName);
    }
  }

  $emit(eventName, ...args) {
    const handlers = this.handlers[eventName];
    if (handlers) {
      handlers.forEach((handler) => {
        handler(...args);
      });
    }
  }

  $off(eventName) {
    delete this.handlers[eventName];
  }
}

export default {
  install: (Vue) => {
    Vue.prototype.$eventBus = new EventBus(Vue);
    Vue.mixin({
      beforeDestroy() {
        this.$eventBus.$offVmEvent(this._uid);
      },
    });
  },
};
