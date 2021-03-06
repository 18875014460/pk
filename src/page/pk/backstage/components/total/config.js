import {request} from '../../request'

// 基础接口

//获取年度列表
function getYears(unitId) {
    return request("GET", '/api/base/years/no_auth', { unitId: unitId })
};

//获取学期列表
function getTerms(unitId, yearValue) {
    return request("GET", '/api/base/term/no_auth', { unitId: unitId, year: yearValue })
};

//获取节次
function getFestival(params) {
    return request("GET", '/api/base/festival', params)
};
/* 获得国标星期 */
function getBb(params) {
    return request('GET', '/api/base/codeitem/type/no_auth/' + params);
};

//排课接口

//获取年级列表
function getGrades(params) {
    return request("GET", '/api/pk/solution/select_pk_grade_by_term_and_type', params)
};

//获取周次下拉
function getWeeks(params) {
    return request("GET", '/api/pk/solution/select_week', params)
};

//获取列表
function getTable(params) {
    if (params.flag) {
        return request("POST", '/api/pk/sheet/class_sheet', params)
    } else {
        return request("POST", '/api/pk/sheet/teacher_sheet', params)
    }
};

export default {
    getYears,
    getTerms,
    getFestival,
    getGrades,
    getWeeks,
    getTable,
    getBb
}