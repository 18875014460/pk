import request from '../../../api';

// 清除错误登录信息
export let clearLoginErrorMsg = (id) => {
    return request('delete', '/api/base/login/lock/' + id);
};

// 获得权限
export let getRcCodeList = (code) => {
    return request('get', '/api/base/resource/user/code', { code });
};

// 查询组织部门tree
export let getTree = (params) => {
    return request('get', '/api/base/orgTree', params);
};

// 查询组织年级班级tree
export let getClassCourseTree = (params) => {
    return request('get', '/api/base/gradeClassTree', params);
};

// 根据单位查询单位课程
export let getUnitClassListByUnitId = (unitId) => {
    return request('get', '/api/base/course/active', { unitId });
};

// 根据单位获取部门
export let getOrgByUnit = (id) => {
    return request('get', '/api/base/org', { unitId: id });
};

// 根据单位获取部门树
export let getOrgByUnitTree = (id) => {
    return request('get', '/api/base/orgTree/' + id, '');
};

// 用户性别查询
export let getGender = (id) => {
    return request('get', '/api/base/codeitem/type/XB', id);
};

// 获取荣誉称号
export let getRYCH = (id) => {
    return request('get', '/api/base/codeitem/type/RYCH', id);
};

// 获取年级
// export let getGrad = (id) => {
//     return request('get', '/api/base/grade', { unitId: id });
// };
export let getGrad = (id) => {
    return request('get', '/api/base/grade/active', { unitId: id });
};

// 获取课程
export let getClass = (id) => {
    return request('get', '/api/base/course', { unitId: id });
};

// 获取班级
export let getClassList = (id) => {
    return request('get', '/api/base/clazz', { gradeId: id });
};

// 校验登录账号是否存在
export let validataAccount = (loginName) => {
    return request('get', '/api/base/user/validata/account', { loginName });
};

// 校验Email是否存在
export let validataEmail = (email) => {
    return request('get', '/api/base/user/validata/email', { email });
};

// 校验身份证号码是否存在
export let validataIdcard = (idCard) => {
    return request('get', '/api/base/user/validata/idcard', { idCard });
};

// 校验手机号码是否存在
export let validataMobile = (mobile) => {
    return request('get', '/api/base/user/validata/mobile', { mobile });
};

// 考勤号是否存在
export let validataPin = (unitId, pin) => {
    return request('get', '/api/base/user/validata/pin', { unitId, pin });
};

// 入学学号是否存在
export let validataNumber = (unitId, number) => {
    return request('get', '/api/base/user/validata/number', { unitId, number });
};

// 锁定解锁拥护
export let openCloseUser = (userId, status) => {
    return request('post', '/api/base/user/status', { userId, status });
};

// 查看用户具有的栏目
export let getUserAuth = (id) => {
    return request('get', '/api/base/resource/tree/' + id, '');
};

// 上传头像地址
export let imgUrl = window.ShiYue.base + '/zuul/api/storage/upload/type';

// 显示头像
export let showImgUrl = window.ShiYue.base + '/api/storage/show/thumbnail/';

// 查询组织年级tree
export let getClassTree = (params) => {
    return request('get', '/api/base/gradeTree', params);
};

// 根据年级查询班级
export let getClassByGradId = (params) => {
    return request('get', '/api/base/clazz', params);
};
/*----------------------------------------教职工-------------------------------------------------*/

// 查询是否可以发短信
export let checkMessage = () => {
    return request('get', '/api/base/teacher/sms_is_open');
};

// 查询教师用户
export let getTheacherList = (params) => {
    return request('get', '/api/base/teacher', params);
};

// 查询教师用户/id
export let getTheacherById = (id) => {
    return request('get', '/api/base/teacher/' + id, '');
};

// 添加教职工
export let addnewTeacher = (params) => {
    return request('post', '/api/base/teacher', params);
};

// 修改教职工
export let updataTeacher = (params) => {
    return request('put', '/api/base/teacher', params);
};

// 删除用户
export let deleteTeacher = (id) => {
    return request('delete', '/api/base/teacher/' + id, '');
}

// 批量删除用户
export let deleteTeachers = (params) => {
    return request('post', '/api/base/teacher/deletes', params);
}

// 查询Excel列
export let getExcelList = (params) => {
    return request('get', '/api/base/teacher/download', params);
};

// 教职工导出Excel
export let exportExcel = (params) => {
    return request('post', '/api/base/teacher/download', params);
};

// 查询非业务角色
export let getNobuisiRole = (params) => {
    return request('get', '/api/base/role/nobuisi', params);
};

// 角色委派
export let roleDelegate = (roleIds = '', userIds = '') => {
    return request('post', '/api/base/role/user/delegate', { roleIds, userIds });
};

// 教师排序
export let sortTeacher = (teacherSorts) => {
    return request('put', '/api/base/teacher/sort', teacherSorts);
};

// 下载教职工导入模板
export let downloadImportTemplate = (params) => {
    return request('get', '/api/base/teacher/download/import/template', params);
};
export let downloadParams = {
    base: '/api/base/teacher/download/import/template'
}
export let downloadTeacherImportPass = {
    base: '/api/base/teacher/download/password'
};
// 查询教职工导入模板列
export let downloadImportColumns = (params) => {
    return request('get', '/api/base/teacher/find/import/columns', params);
};

// 导入教职工
export let importTeachers = {
    base: '/zuul/api/base/teacher/import',
    params: {
        unitId: '',
        sendSms: '',
        smsContent: '',
        radomPasswrod: '',
        radomLoginName: '',
        prfix: ''
    }
};

// 查询教职工角色
export let getUsersRoles = (userIds) => {
    return request('post', '/api/base/role/user', { userIds });
};

/*----------------------------------------学生-------------------------------------------------*/

// 查询学生用户
export let getStudentList = (params) => {
    return request('post', '/api/base/find/student', params);
};

// 查询学生用户
export let getStudentById = (studentId) => {
    return request('get', '/api/base/student/find', { studentId });
};

// 新增学生
export let addNewStudentList = (params) => {
    return request('post', '/api/base/student', params);
};

// 注销学生用户
export let deleteStudent = (studentId) => {
    return request('delete', '/api/base/student/' + studentId, '');
}

// 批量注销学生用户
export let deleteStudents = (ids) => {
    return request('post', '/api/base/student/deletes', { ids });
}

// 修改学生用户
export let updataStudent = (params) => {
    return request('post', '/api/base/student/update', params);
}

// 查询未分班学生
export let getFreeStudentList = (studentId) => {
    return request('get', '/api/base/student/' + studentId, '');
}

// 查询分班学生
export let getClassStudentList = (unitId, classId) => {
    return request('get', '/api/base/student/' + unitId + '/' + classId, '');
}

// 查询Excel列
export let getStudentExcelList = (params) => {
    return request('get', '/api/base/student/download', params);
};

// 教职工导出Excel
export let exportStudentExcel = (params) => {
    return request('post', '/api/base/student/download', params);
};

// 下载学生导入模板
export let downloadStudentImportTemplate = (params) => {
    return request('post', '/api/base/student/download_import_template', params);
};
export let downloadStudentImportTemplateBase = '/api/base/student/download_import_template';

// 下载学号导入模板
export let downloadPortImportTemplateBase = '/api/base/student/templete_account';

// 导入学生
export let importStudents = {
    base: '/zuul/api/base/student/student_import'
}

// 学号导入
export let importStudentsCode = {
    base: '/zuul/api/base/student/batchUpdate'
}

/*----------------------------------------学生类型-------------------------------------------------*/

// 通过unitId 查询学生类型
export let getStudentType = (unitId) => {
    return request('get', '/api/base/studentType', { unitId });
};

// 修改学生类型
export let updataStudentType = (params) => {
    return request('put', '/api/base/studentType', params);
};

// 新增学生类型
export let addStudentType = (params) => {
    return request('post', '/api/base/studentType', params);
};

// 新增学生类型
export let deleteStudentType = (id) => {
    return request('delete', '/api/base/studentType/' + id, '');
};

// 验证学生类型名称
export let checkStudentTypeName = (params) => {
    return request('get', '/api/base/studentType/nameExist', params);
};

/*----------------------------------------家长-------------------------------------------------*/

// 查询家长用户
export let getParentList = (params) => {
    return request('get', '/api/base/parentUser', params);
};

// 修改家长用户
export let updataParentList = (params) => {
    return request('put', '/api/base/parentUser', params);
};

// 查询Excel列
export let getParentExcelList = (params) => {
    return request('get', '/api/base/parent/download', params);
};

// 教职工导出Excel
// POST
// /api/base/parent/download、
// let parmas = {
//     unitId: '',
//     gradeId: '',
//     classId: '',
//     downloadOptions: ''
// }