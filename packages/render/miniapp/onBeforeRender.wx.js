import { delayMounts, pageState, _getApp } from './utils';
export function onBeforeRender(fiber) {
    let type = fiber.type;
    let instance = fiber.stateNode;
    if (type.reactInstances) {
        let uuid = fiber.props['data-instance-uid'] || null;
        if (!instance.instanceUid) {
            instance.instanceUid = uuid;
        }
        if (fiber.props.isPageComponent) {
            let wx = pageState.wx;
            console.log('获取pageState.wx', wx);
            instance.wx = wx;
            wx.reactInstance = instance;
        }
        //只处理component目录下的组件
        let wxInstances = type.wxInstances;
        if (wxInstances) {
            //必须在这里进行多一次匹配，否则组件没有数据
            for (var i = wxInstances.length - 1; i >= 0; i--) {
                var el = wxInstances[i];
                if (el.dataset.instanceUid === uuid) {
                    el.reactInstance = instance;
                    instance.wx = el;
                    wxInstances.splice(i, 1);
                    break;
                }
            }
            if (!instance.wx) {
                type.reactInstances.push(instance);
            }
        }
    }
    if (!pageState.isReady && instance.componentDidMount) {
        delayMounts.push({
            instance: instance,
            fn: instance.componentDidMount
        });
        instance.componentDidMount = Date;
    }
}
