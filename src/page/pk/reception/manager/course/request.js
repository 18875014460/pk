import api from '@/api';
export let request = (method, url, params, serializer = true) => {
    return api(method, url, params, serializer, {
        headers: {
            'Sy-Headers': 'device=pc;app=pk'
        }
    })
};
// 查询组织年级班级tree
// export let getClassCourseTree = (params) => {
//     return request('get', '/api/base/gradeClassTree', params);
// };

// 查询组织年级tree
// export let getClassTree = (params) => {
//     return request('get', '/api/base/gradeTree', params);
// };

// 查询教师tree
// export let getTeacherTree = (params) => {
//     return request('get', '/teacher/org_gro', params);
// };


// 查询组织年级班级tree
export let getClassCourseTree = (params) => {
    return request('get', '/api/base/gradeClassTree', params);
};

// 查询组织年级tree
export let getClassTree = (params) => {
    return request('get', '/api/base/gradeTree', params);
};

// 查询教师tree
export let selectCourseTeacherBySolution = (params) => {
    return request('get', 'api/pk/time_rule_teacher_group/select_course_time_teaher', params);
};

//根据单位ID查询场地
export let findUnit = (params) => {
    return request('get','api/base/place/find_unit',params);
}


