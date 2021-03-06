import request from '../../../api';
export let getUnitList = (params) => {
        return request('GET', '/api/base/unit', params);
    }
    //获取单位列表
export let addUnitListVal = (params) => {
        return request('POST', '/api/base/unit', params);
    }
    //添加单位
export let updataUnitList = (params) => {
        return request('PUT', '/api/base/unit', params);
    }
    //删除单位
export let deleteUnitList = (params) => {
        return request('DELETE', '/api/base/unit/' + params.id);
    }
    //根据主键获取旧值
export let getUnitData = (params) => {
        return request('GET', '/api/base/unit/' + params);
    }
    //批量删除单位列表
export let deleteUnitAllList = (params) => {
        return request('POST', '/api/base/unit/delete', params);
    }
    //添加下拉树列表
export let addDropdownTreeList = (params) => {
        return request('GET', '/api/base/unit/unitTypeTree', params);
    }
    //获取省份
export let getUnitProvince = (params) => {
        return request('GET', '/api/base/provcity/province', params);
    }
    //获取城市
export let getUnitCities = (params) => {
        return request('GET', '/api/base/provcity/city?provinceName=' + params);
    }
    //获取县级
export let getUnitCounty = (params) => {
        return request('GET', '/api/base/provcity/piecearea', params);
    }
    //根据行政区获取统一编码
export let getUnitCountyNumber = (params) => {
        return request('GET', '/api/base/provcity/county', params);
    }
    //单位名称重名验证
export let verificationUnitName = (params) => {
        return request('GET', '/api/base/unit/nameExist?name=' + params);
    }
    //验证单位名称重名
export let verificationUnicode = (params) => {
        return request('GET', '/api/base/unit/unitCodeExist?code=' + params);
    }
    //获取单位树
export let getUnitTree = (params) => {
    return request('GET', '/api/base/unitTree', params);
};
//获取场地类型列表
export let getSiteType = (params) => {
    return request('GET', '/api/base/placeType' + params);
};
//删除场地类型
export let deleteSiteType = (params) => {
    return request('DELETE', '/api/base/placeType/' + params);
};
//添加场地类型
export let addSiteType = (params) => {
    return request('POST', '/api/base/placeType', params);
};
//验证场地类型重名（—添加）
export let verificationSiteTypeName = (params) => {
    return request('GET', '/api/base/placeType/nameExistForSave', params);
};
//验证场地类型名称重名（—修改）
export let verifiEditSiteTypeName = (params) => {
    return request('GET', '/api/base/placeType/nameExistForUpdate', params);
};
//根据主键获取旧值
export let editSiteTypeNameVif = (params) => {
    return request('GET', '/api/base/placeType/' + params);
};
//编辑场地类型
export let editSiteType = (params) => {
    return request('PUT', '/api/base/placeType', params);
};
//获取场地列表
export let getSiteList = (params) => {
    return request('GET', '/api/base/place', params);
};
//添加场地
export let addSite = (params) => {
    return request('POST', '/api/base/place', params);
};
//验证场地名称重名（添加）
export let verifiAddSiteName = (params) => {
    return request('GET', '/api/base/place/nameExistForSave', params);
};
//验证场地地址重名（添加）
export let verifiAddSiteAddress = (params) => {
    return request('GET', '/api/base/place/addressExistForSave', params);
};
//验证场地名称重名（编辑）
export let verifiEditSiteName = (params) => {
    return request('GET', '/api/base/place/nameExistForUpdate', params);
};
//验证场地地址重名（编辑）
export let verifiEditSiteAddress = (params) => {
    return request('GET', '/api/base/place/addressExistForUpdate', params);
};
//根据主键获取场地旧值
export let editSiteVif = (params) => {
    return request('GET', '/api/base/place/' + params);
};
//编辑场地
export let editSite = (params) => {
    return request('PUT', '/api/base/place', params);
};
//删除场地
export let deleteSiteList = (params) => {
    return request('DELETE', '/api/base/place/' + params);
};
//批量删除场地
export let batchRemoveSiteList = (params) => {
    return request('POST', '/api/base/deletePlaces', params);
};
//调用数据字典里面的国标接口{codeId}
export let getCodeId = (params) => {
    return request('GET', '/api/base/codeitem/type/' + params);
};
//修改弹出框中获取行政区名称
export let getFullName = (params) => {
    return request('GET', '/api/base/provcity/full_name', params);
};
// 上传头像地址
export let imgUrl = window.ShiYue.base + '/zuul/api/storage/upload/type';

// 显示头像
export let showImgUrl = window.ShiYue.base + '/api/storage/show/thumbnail/';
//用户名的唯一性校验
export let checkUserName = (params) => {
        return request('GET', '/api/base/user/validata/account', params);
    }
    //根据办学类型查询学段
export let getStageName = (params) => {
        return request('GET', '/api/base/stage/bxlx?value=' + params);
    }
    //根据当前登陆用户判断单位类型
export let getUnitType = (params) => {
        return request('GET', '/api/base/unit/unitType', params);
    }
    //校验电话号码唯一性
export let validataPhone = (idCard) => {
    return request('GET', '/api/base/user/validata/mobile', params);
};
//导入
export let importSited = {
    base: '/zuul/api/base/placeUpload',
    params: {
        unitId: ''
    }
};