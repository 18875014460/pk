<template>
  <div class="teachingSetting app-container-box">
    <sy-grad-4>
      <div slot="headerRight">
        <div class="top-panel">
          <a href="/pk/pre/home">排课方案</a>>>{{solutionName}}
        </div>
      </div>
      <div slot="bodyRight">
        <sy-grad-4>
          <div slot="headerRight">
            <div class="top_title">
              任教设置
            </div>
            <div class="back">
              <el-button type="primary" @click="back">返回</el-button>
            </div>
          </div>
          <div slot="bodyRight">
            <!--左侧内容区-->
            <div class="contentLeft">
              <el-tabs v-model="activeName1" @tab-click="handleClick">
                <el-tab-pane label="列表" name="tLists1">
                  <div class="lists">
                    <div class="head">
                      年级:
                      <el-select v-model="leftList.selectGradeId" placeholder="请选择" @change="toGetCourse">
                        <el-option v-for="item in leftList.grades" :key="item.gradeId" :label="item.gradeName" :value="item.gradeId"></el-option>
                      </el-select>
                      课程：
                      <el-select v-model="leftList.selectcourseId" placeholder="请选择" @change="getTeacherData">
                        <el-option v-for="item in leftList.courses" :key="item.courseId" :label="item.courseName" :value="item.courseId"></el-option>
                      </el-select>
                    </div>
                    <div class="cont" style="padding:0px 10px;">
                      <el-table :highlight-current-row="true" :data="leftList.listsData" @row-click="toSelectClazzInfo"  border style="height:auto;width:auto;">
                        <el-table-column prop="gradeName" label="年级" align="center"></el-table-column>
                        <el-table-column prop="className" label="班级" align="center"></el-table-column>
                        <el-table-column label="教师" align="center">
                          <template scope="scope">
                            <span v-for="item in scope.row.teacherVMS" :key="item.teacherId">
                              {{item.teacherName}}
                            </span>
                          </template>
                        </el-table-column>
                        <el-table-column label="删除" align="center">
                          <template scope="scope">
                            <el-button type="text" @click="toDeleteTeacher(scope.$index,scope.row)">删除该行教师</el-button>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="课程-班级" name="cclass">
                  <div class="courseClassTree">
                    <el-tree style="padding: 0;" :highlight-current="true" 
                      lazy
                      :data="CourseClassList.GradeCourseClazzTreeData" 
                      :props="defaultProps" 
                      :filter-node-method="filterNode" 
                      node-key="gradeId" 
                      @node-click="getChildrenCourse" 
                      :load="loadCourseClazzData"
                      :render-content="renderContent"
                    ></el-tree>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="班级-课程" name="ccourse">
                  <div class="courseClassTree">
                    <el-tree 
                      lazy
                      :highlight-current="true" 
                      :data="CourseClassList.GradeClazzCourseTreeData" 
                      :props="defaultProps" 
                      :load="loadClazzCourseData" 
                      :render-content = "renderContent2"
                      @node-click="getChildrenClazz" ></el-tree>
                    </div>
                </el-tab-pane>
              </el-tabs>              
            </div>
            <!--中间内容区-->
            <div class="contentCenter">
              <div class="confirmBtn" @click="toSetbatchTeach">
                <
              </div>
            </div>
            <!--右侧内容区-->
            <div class="contentRight">
              <el-tabs v-model="activeName2" @tab-click="handleClick">
                <el-tab-pane label="列表" name="tLists2">
                  <div class="lists">
                    <div class="head">
                      <el-row>
                        <el-col :span="4">关键字：</el-col>
                        <el-col :span="20">
                          <el-input v-model='keyWordToSearchTeacher' placeholder="请输入教师名称查找" icon="search"></el-input>
                        </el-col>
                      </el-row>
                    </div>
                    <div class="cont">
                      <el-table @row-click="toSetTeachInfo" :highlight-current-row='true' :data="filterTableData" border style="width: 100%"  @selection-change="handleSelectionChange">
                        <el-table-column type="selection" width="55"> </el-table-column>
                        <el-table-column prop="teacherName" label="姓名" align="center"></el-table-column>
                        <el-table-column prop="courseName" label="课程" align="center"></el-table-column>
                      </el-table>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="课程" name="course">
                  <div class="lists rightTree">
                    <div class="btnGroup">
                      <el-button @click="changeExpande('expend')">折叠</el-button>
                      <el-button @click="changeExpande('unexpend')">展开</el-button>
                    </div>
                    <el-tree :default-expanded-keys="ExpandedData" ref="rightTree" :filter-node-method="filterNode" node-key="courseId" @check-change="handleCheckChange" show-checkbox :data="rightList.treeData" :highlight-current="true" :props="defaultProps"></el-tree>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </sy-grad-4>
      </div>
    </sy-grad-4>
  </div>
</template>

<script>
  import {selectGradeCourse,CoursetoTeach,batchSetTeachList,deleteTeacher,getClassByUnitAndGrade,getClazzCourseList,batchTeach,selectClazzByGradeId,selectCourseTeacherByClazz} from '../request';
  import _ from 'lodash';
  export default {
    data(){
      return {
        solutionId:'',
        activeName1: 'tLists1',
        activeName2: 'tLists2',
        // 列表数据
        leftList:{
          grades:[],
          selectGradeId:'',
          courses:[],
          selectcourseId:'',
          listsData:[],
        },
        // 课程-班级数据
        CourseClassList:{
          grades:[],
          GradeCourseClazzTreeData:[],
          GradeClazzCourseTreeData:[],
        },
        defaultProps: {
          label: 'label',
          children: 'children',
        },
        rightList:{
          tableData:[],
          treeData:[]
        },
        unitId:'',
        keyWordToSearchTeacher:'',
        // 批量设置任教
        gradeClassCourseId:'',
        teacherIds:[],
        node:'',
        node2:'',
        isExpendAll:false,
        solutionName:'',
        // 默认展开的数据
        ExpandedData:[],
        defaultExpanded:[],
      }
    },
    created(){
      this._init();
      this.solutionId = window.sessionStorage.getItem("solutionId");
      this.solutionName = window.sessionStorage.getItem("solutionName");
      // 获取列表页的年级课程信息
      this.getTeacherAndCourseData();
      // 获取右侧所有教师任教数据
      this.selectCoursetoTeach()
    },
    computed:{
      // 右侧表格数据搜索
      filterTableData(){
        if(!this.keyWordToSearchTeacher){
          return this.rightList.tableData;
        }else{
          let key = this.keyWordToSearchTeacher;
          let array = [];
          array = this.rightList.tableData.filter(function(item){
            if(String(item.teacherName).toLowerCase().indexOf(key) != -1 || String(item.courseName).toLowerCase().indexOf(key) != -1){
              return item;
            }
          })
          return array;
        }        
      }
    },
    methods:{
      handleClick(tab, event) {
        // 点击对应的菜单后请求不同的数据
        if(tab.name =='cclass'){
          this.GradeCourseClazzTree();
        }else if(tab.name == 'ccourse'){
          this.GradeClazzCourseTree();
        }else if(tab.name == 'tLists1'){
          this.selectBatchTeach();
        }  
        // 右侧数据刷新
        if(tab.name =='tLists2' || tab.name == 'course'){
          this.selectCoursetoTeach();
        } 
      },
      // 过滤节点
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      _init() {
        let userMsg = this.$getSess('user');
        if (userMsg && userMsg.data ) {
          if (userMsg.data.unitId) {
            this.unitId = userMsg.data.unitId;
          }
        }
      },
      /*列表页方法开始*/
      // 获取下拉菜单中的年级课程数据
      getTeacherAndCourseData(){
        let params = {solutionId:this.solutionId}
        selectGradeCourse(params).then((results)=>{
          if(results && results.code =='ok'){
            this.leftList.grades = [];
            this.leftList.grades = results.data;
            this.CourseClassList.grades = results.data;
            // 设置默认选中
            this.leftList.selectGradeId = this.leftList.grades[0].gradeId;
          }
        })
      },
      // 年级改变选择课程
      toGetCourse(gradeId){
        // 清空表格数据
        this.leftList.listsData = [];
        // 获取当前年级
        this.leftList.selectGradeId = gradeId;
        let grades = this.leftList.grades;
        // 选择课程数据
        if(grades !== null){
          grades.forEach((item)=>{
            if(item.gradeId == gradeId){
              this.leftList.courses = [];
              this.leftList.courses = item.pkCourseVMS;
              // 第一条课程数据默认选中
              this.leftList.selectcourseId = this.leftList.courses[0].courseId;
              // 根据当前年级请求班级数据
              this.getTeacherData(this.leftList.selectcourseId)
            }
          })
        }
      },
      // 课程改变时获取课程id
      getTeacherData(courseId){
        this.leftList.selectCourseId = courseId;
        this.selectBatchTeach();
      },
      // 查询批量任教列表
      selectBatchTeach(){
        let params = {
          solutionId:this.solutionId,
          gradeId:this.leftList.selectGradeId,
          courseId:this.leftList.selectCourseId
        }
        batchSetTeachList(params).then((results)=>{
          if(results && results.code =='ok'){
            this.leftList.listsData = results.data;
          }
        })
      },
      // 删除课程下的任教
      toDeleteTeacher(index,row){
        deleteTeacher({gradeClassCourseId:row.id}).then((results)=>{
          if(results && results.code =='ok'){
            this.$notify({title:'成功', type:'success', message:'删除教师成功！'})
            this.selectBatchTeach();
          }
        })
      },
      /*列表页方法结束*/

      /*课程-班级  开始*/
      // 获取课程并转换为树格式
      GradeCourseClazzTree(){
        let GradeCourseClazzTreeData = [];
        if(this.CourseClassList.grades != null){
          this.CourseClassList.grades.forEach((item)=>{
            item.pkCourseVMS.forEach((items)=>{
              items.courseId = items.courseId;
              items.label = items.courseShortName;
              items.gradeId = item.gradeId;
              items.children = [];
            })
            GradeCourseClazzTreeData.push({
              gradeId:item.gradeId,
              label:item.gradeName,
              children:item.pkCourseVMS
            })           
          })          
        } 
        this.CourseClassList.GradeCourseClazzTreeData = GradeCourseClazzTreeData;
      },
      // 处理课程和班级任教数据
      loadCourseClazzData(node,resolve){
        if (node.level === 1 && node.data.children !== []){
          resolve(node.data.children)
        }else if(node.level ===2 && node.data.children !== []){
          let params = {
              courseId:node.data.courseId,
              gradeId:node.data.gradeId,
              solutionId:this.solutionId
          }
          batchSetTeachList(params).then((results)=>{
            if(results && results.code =='ok'){
              results.data.forEach((item)=>{
                let teachers = []
                if(item.teacherVMS.length != 0){
                  item.teacherVMS.forEach((itemx)=>{
                    teachers.push(itemx.teacherName);
                  })
                  item.gradeClassCourseId = item.id;
                  item.label = item.className + teachers;
                }else{
                  item.gradeClassCourseId = item.id;
                  item.label = item.className;
                }
              })
              resolve(results.data);  
            }else{
              resolve([])
            }
          })
        }else{
          resolve([]);
        }
      },
      // 删除按钮
      renderContent(h, {node, data, store}) {
        // 如果是一级和二级树,没有加号
        if(!data.gradeClassCourseId){
          return h('span', {attrs: {class: 'sy-span-resAuth'}
            }, [
              h('span', node.label),
            ]);
        }else{
          // 如果有教师的话
          if(node.data.teacherVMS.length > 0 ){
            return h('span',{
                attrs: {
                  class: "sy-span-resAuth",              
                },
                },[
                  h('span', node.label),
                  h('i', {
                      attrs: {
                          class: "fa fa-times",
                          style: `font-size:14px;color:#75D0E2;margin-left:15px;color:red;display:inlin-block}`,
                          title: "删除",
                          "aria-hidden": true
                      }, on: {
                        click: (e) => {
                          e.stopPropagation();
                          this.$confirm('确定删除该班级教师？, 是否继续?', '提示', {
                              confirmButtonText: '确定',
                              cancelButtonText: '取消',
                              type: 'warning'
                          }).then(() => {
                            deleteTeacher({gradeClassCourseId:node.data.gradeClassCourseId}).then((results)=>{
                              if(results && results.code =='ok'){
                                this.$notify({type:'success', title:'成功', message:'删除教师成功！'})
                                this.GradeCourseClazzTree();
                              }
                            })
                          })
                        }
                      }
                  })
                ])
            }
            else{
              return h('span', {attrs: {class: 'sy-span-resAuth'}
                }, [
                  h('span', node.label),
                ]);
              }
          }
      },
      // 点击事件确定要安排任教的班级
      getChildrenCourse(node){
        this.node = node;
        if(node.children){
          // this.leftList.selectGradeId = node.gradeId;
        }else{
          this.gradeClassCourseId= node.id;
        }
      },    
      /*课程-班级  结束*/
      /*班级课程   开始*/
      // 请求年级信息
      GradeClazzCourseTree(){
        let GradeCourseClazzTreeData = [];
        if(this.CourseClassList.grades != null){
          this.CourseClassList.grades.forEach((item)=>{
            GradeCourseClazzTreeData.push({
              gradeId:item.gradeId,
              label:item.gradeName
            })
          })
        }
        this.CourseClassList.GradeClazzCourseTreeData = GradeCourseClazzTreeData;
      },  
      loadClazzCourseData(node,resolve){
        if (node.level === 1){
          // 请求班级数据 根据年级id获取班级
          selectClazzByGradeId({gradeId:node.data.gradeId}).then((results)=>{
            let clazz = [];
            if(results && results.code =='ok'){
              if(results.data.length == 0){
                resolve([])
              }else{
                 results.data.forEach((item)=>{
                  clazz.push({
                    clazzId:item.id,
                    label:item.name,
                    gradeId:node.data.gradeId
                  })
                  resolve(clazz);
                })
              }
            }
          })
        }
        if(node.level === 2){
          // 请求班级下的课程任教
          selectCourseTeacherByClazz({solutionId:this.solutionId,classId:node.data.clazzId}).then((results)=>{
            if(results && results.code=='ok' && results.data.length !=0){
              let courses = [];
              results.data.forEach((item)=>{
                let teachers = []
                item.teacherVMS.forEach((itemx)=>{
                  teachers.push(itemx.teacherName);
                })
                courses.push({
                  courseId:item.courseId,
                  gradeClassCourseId:item.gradeClassCourseId,
                  label:item.courseName + teachers,
                  teacherVMS:item.teacherVMS
                })        
              })
              resolve(courses);   
            }else{
              resolve([])
            }
          })
        }else{
          resolve([]);
        } 
      },
      renderContent2(h, {node, data, store}) {
        // 如果是一级和二级树,没有加号
        if(!data.gradeClassCourseId){
          return h('span', {attrs: {class: 'sy-span-resAuth'}
            }, [
              h('span', node.label),
            ]);
        }else{
          // 如果有教师的话
          if(node.data.teacherVMS.length > 0){
            return h('span',{
            attrs: {
              class: "sy-span-resAuth",              
            },
            },[
              h('span', node.label),
              h('i', {
                  attrs: {
                      class: "fa fa-times",
                      style: `font-size:14px;color:#75D0E2;margin-left:15px;color:red;display:inlin-block}`,
                      title: "删除",
                      "aria-hidden": true
                  }, on: {
                    click: (e) => {
                      e.stopPropagation();
                      this.$confirm('确定删除该班级教师？, 是否继续?', '提示', {
                          confirmButtonText: '确定',
                          cancelButtonText: '取消',
                          type: 'warning'
                      }).then(() => {
                        deleteTeacher({gradeClassCourseId:node.data.gradeClassCourseId}).then((results)=>{
                          if(results && results.code =='ok'){
                            this.$notify({type:'success', title:'成功', message:'删除教师成功！'})
                            this.GradeClazzCourseTree();
                          }
                        })
                      })
                    }
                  }
              })
            ])
          }
          // 如果有教师的话就显示加号
          else{
            return h('span', {attrs: {class: 'sy-span-resAuth'}
              }, [
                h('span', node.label),
              ]);
          }
        }
      },
      getChildrenClazz(node){
        this.node2 = node;
        if(node.children){
          // 根据当前年级查找右侧数据
          // this.leftList.selectGradeId = node.gradeId;
          // this.selectCoursetoTeach()
        }else{
          this.gradeClassCourseId = node.gradeClassCourseId;
        }        
      },
      /*班级课程   结束*/
      /*右侧  开始*/
      // 查询年级下课程的任教情况
      selectCoursetoTeach(){
        // 应该是改方案下所有的教师
        let params = {
          solutionId:this.solutionId,
        }
        // 根据方案查找  课程任教列表
        CoursetoTeach(params).then((results) =>{
          if(results && results.code =='ok' && results.data.length >0){
            // 列表格式
            let teacherList = [];
            results.data.forEach((item)=>{
              if(item.teacherVMS != null){
                item.teacherVMS.forEach((itemx)=>{
                  teacherList.push({
                    courseId:item.courseId,
                    courseName:item.courseName,
                    courseShortName:item.courseShortName,
                    gradeClassCourseId:item.gradeClassCourseId,
                    teacherId:itemx.teacherId,
                    teacherName:itemx.teacherName
                  })
                })
              }
            })
            // 树格式
            let teacherTree = [];
            this.defaultExpanded = [];
            results.data.forEach((item)=>{
              let teachers = [];
              // 获取所有要展开的树的id
              item.teacherVMS.forEach((teach)=>{
                teachers.push({
                  id:teach.teacherId,
                  label:teach.teacherName
                })
              })
              teacherTree.push({
                id:item.gradeClassCourseId,
                courseId:item.courseId,
                label:item.courseName,
                children:teachers
              })
              // 所有的课程id,展开时要获取所有的课程id
              if(item.courseId){
                this.defaultExpanded.push(item.courseId);
              }
            })
            this.rightList.tableData = teacherList;
            this.rightList.treeData = teacherTree;
          }
        })
      },
      // 列表获取班级信息
      toSelectClazzInfo(row,e,col){
        this.gradeClassCourseId = row.id;
      },
      handleSelectionChange(val){
        let teachers = [];
        if(val){
          val.forEach((item)=>{
            teachers.push(item.teacherId)
          })
        }
        this.teacherIds= teachers;
      },  
      // 右侧树获取教师
      handleCheckChange(node){
        let teacherIds = [];
        let checkTeacherIds = this.$refs.rightTree.getCheckedNodes();
        checkTeacherIds.forEach((item)=>{
          if(!item.children){
            teacherIds.push(item.id);
          }
        })
        this.teacherIds = teacherIds;
      },
      // 展开  收缩
      changeExpande(t){
        if(t === 'expend'){
          this.ExpandedData = []; 
          this.selectCoursetoTeach();
        }else if(t === 'unexpend'){
          this.ExpandedData = this.defaultExpanded;
        }
      },
      // 设置任教
      toSetbatchTeach(){
        let params = {
          teacherIds:this.teacherIds,
          gradeClassCourseId:this.gradeClassCourseId
        }
        batchTeach(params).then((results)=>{
          if(results && results.code =='ok'){
            this.$notify({type:'success', title:'成功', message:'设置成功！'})
            this.selectBatchTeach();
            this.GradeCourseClazzTree();
          }
        })
      },
      // 返回
      back(){
        this.$router.push('/pk/pre/manager/courseManager/adminCourse')
      }
    }
  }
</script>

<style>
  .teachingSetting .top-panel{
    width:100%;
    height: 40px;
    line-height: 40px;
    padding: 0 12px;
    border-bottom: 1px solid #c6c8d4;
    background-color: #fcfcfc;
    font-weight:normal;
  }
  .teachingSetting .top_title{
    height: 40px;
    line-height: 40px;
    padding: 0 12px;
    font-size:16px;
  }
  .teachingSetting .back{
    position: absolute;
    top:0px; 
    right:0px; 
    margin-top:5px;
    margin-right:20px;
  }
  .teachingSetting .contentLeft{
    position: absolute;
    border-right: 1px solid #CCCCCC;
    border-bottom: 1px solid #CCCCCC;
    width: 50%;
    top:0;
    left:0;
    bottom:0px;
  }
  .teachingSetting .lists{
    position: absolute;
    top:0px;
    bottom:40px;
    width:95%;
  }
  .teachingSetting .courseClassTree,.teachingSetting .courseClassTree{
    position: absolute;
    top:0px;
    bottom:40px;
    width:95%;
    overflow: scroll;
  }
  .teachingSetting .head {
    position: absolute;
    top:0px;
    height:45px;
    width:80%;
    margin-top: -10px;
    height: 56px;
    line-height: 56px;
  }
  .teachingSetting .cont{
    width:100%;
    position: absolute;
    top:45px;
    height:88%;
    bottom:100px;
    overflow: scroll;
  }
  .teachingSetting .delBtn{
    color: #FF0000;
    cursor: pointer;
  }
  .teachingSetting .lists .el-input {
    margin-top: 2px;
    width:160px;
  }
  .teachingSetting .contentCenter{
    position: absolute;
    left: 50%;
    top:0;
    bottom:20px;
    width:5%;
  }
  .teachingSetting .contentCenter .confirmBtn {
    position: absolute;
    top:48%;
    left: 20%;
    width:60%;
    height: 1.5em;
    line-height: 1.5em;
    border-radius: 2px;
    color: #ffffff;
    text-align: center;
    font-size:18px;
    background-color: #48c2da;
    cursor: pointer;
  }
  .teachingSetting .contentRight{
    position: relative;
    position: absolute;
    border-left: 1px solid #CCCCCC;
    border-bottom: 1px solid #CCCCCC;
    width: 45%;
    top:0;
    right:0;
    bottom:0px;
  }
  .teachingSetting .rightTree{
    width:100%;
    position: absolute;
    top:0px;
    height:90%;
    bottom:100px;
    overflow: scroll;
  }
  .teachingSetting .el-tabs__content {
    position: absolute;
    height:100%;
    width:100%;
    top:45px;
    bottom:200px;
    overflow: scroll;
    padding: 0 10px;
  }
  .btnGroup{
    margin-bottom: 10px;
  }
</style>
