  <!--固定课首页-->
<template>
  <div class="sy-pk-step-container sy-theme-tableBorder fixedCourse">
    <sy-grad-4 :border="false">
      <div slot="bodyLeft">
        <el-input
        placeholder="输入关键字进行搜索"
        v-model="filterText">
        </el-input>

        <el-tree
        class="filter-tree tree-style"
        :data="data"
        :props="defaultProps"
        node-key="id"
        :filter-node-method="filterNode"
        ref="tree"
        @node-click="getFirstTable"
        >
        </el-tree>
      </div>

      <div slot="bodyRight">
        <div class="bodyRight">
          <div class="topTb">
              <el-table :highlight-current-row='false' :data="tableDataTopGrade" border style="width: 100%" v-if="flag==1" @row-click="rowClick">
                <el-table-column prop="grade" label="年级"></el-table-column>
                <el-table-column prop="subject" label="科目"></el-table-column>
                <el-table-column prop="sum" label="未排/总节数"></el-table-column>
              </el-table>

              <el-table :highlight-current-row='false' :data="tableDataTopTeacher" border style="width: 100%" v-else-if="flag==2" @row-click="rowClick">
                <el-table-column prop="grade" label="年级"></el-table-column>
                <el-table-column prop="clazz" label="班级"></el-table-column>
                <el-table-column prop="subject" label="科目"></el-table-column>
                <el-table-column prop="sum" label="未排/总节数"></el-table-column>
              </el-table>

              <el-table :highlight-current-row='false' :data="tableDataTopPlace" border style="width: 100%" v-else-if="flag==3" @row-click="rowClick">
                <el-table-column prop="grade" label="年级"></el-table-column>
                <el-table-column prop="clazz" label="班级"></el-table-column>
                <el-table-column prop="subject" label="科目"></el-table-column>
                <el-table-column prop="teacher" label="教师"></el-table-column>
                <el-table-column prop="sum" label="未排/总节数"></el-table-column>
              </el-table>

              <el-table :highlight-current-row='false' :data="tableDataTopClass" border style="width: 100%" v-else-if="flag==0" @row-click="rowClick">
                <el-table-column prop="grade" label="年级"></el-table-column>
                <el-table-column prop="clazz" label="班级"></el-table-column>
                <el-table-column prop="subject" label="科目"></el-table-column>
                <el-table-column prop="teacher" label="教师"></el-table-column>
                <el-table-column prop="sum" label="未排/总节数"></el-table-column>
              </el-table>
          </div>
          <div class="bottomTb">
            <!--{{festival}}-->
            <table border="1px" style="border:1px solid #dfe3ec;width:100%;border-collapse:collapse;color:black;box-sizing:border-box;">
              <!-- 表头 -->
              <thead>
                <tr style="height:40px;background-color:#eeeff6">
                  <th>节次/星期</th>
                  <th style="width:11%;">星期一</th>
                  <th style="width:11%;">星期二</th>
                  <th style="width:11%;">星期三</th>
                  <th style="width:11%;">星期四</th>
                  <th style="width:11%;">星期五</th>   
                  <th style="width:11%;">星期六</th>   
                  <th style="width:11%;">星期日</th>          
                </tr>
              </thead>
              <!-- 表体 -->
              <tbody>
                <tr v-for="festival in getFestivals" 
                :key="festival.id" 
                style="height:40px;">
                  <td style="padding:0 18px;width:10%;">
                    {{festival.name}}
                  </td>
                  <td v-for='item in festival.weekRModels' 
                  :key="item.id" 
                  style="padding:0 18px;width:11%;"
                  @click="checkDay(item.festivalId,item.weekId)">
                    {{item.course?item.course.courseName+'&nbsp;'+item.course.teacherName:''}}
                    <i class="el-icon-delete" style="float:right;" @click.stop="del(item.course.id)" v-if="!!item.course"></i>
                    <i class="fa fa-ban" style="margin-left:45%;" v-if="item.flag=='disable'"></i>
                  </td>
                </tr>
              </tbody>
            </table>       
          </div>
        </div>
      </div>
    </sy-grad-4>
  </div>
</template>
<script>
  import {getClassCourseTree,getClassTree,selectCourseTeacherBySolution,findUnit}from '../request.js';
  import {selectGB,selectFestivlaByUnit,deleteCourse,save,selectByClass,selectByGrade,selectByPlace,selectByTeacher,selectTableByClass,selectTableByGrade,selectTableByPlace,selectTableByTeacher,updata,selectGradeBySolution,getClassList} from './request.js';
  export default{
    watch: {
      filterText(val) {
        this.$refs.tree.filter(val);
      }
    },
    data(){
      return {
        flag:'',
        filterText: '',
        data:[{
          label:'班级',
          children:[],
        },{
          label:'教师',
          children:[],
        },{
          label:'场地',
          children:[],
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        tableData:[],
        tableDataTopGrade:[{
          grade:'',
          subject:'',
          sum:'',
          calculate:''
      }],    
        tableDataTopTeacher:[{
          grade:'',
          clazz:'',
          subject:'',
          sum:'',
          calculate:''
      }],        
        tableDataTopPlace:[{
          grade:'',
          clazz:'',
          subject:'',
          teacher:'',
          sum:'',
          calculate:''
        },],
          tableDataTopClass:[{
            grade:'',
            clazz:'',
            subject:'',
            teacher:'',
            sum:'',
            calculate:''
          }],
          classId:'',
          teacherId:'',
          gradeId:'',
          festival:[],
          guobiao:[],
          // 排课模型对象
          course:{
            foreignKeyId:'',
            weekNum:'',
            sectionNum:'',
            courseId:'',
            time:'',
            teacher:[],
            courseName:''
          },
          courses:{
            foreignKeyId:'',
            weekNum:'',
            sectionNum:'',
            courseId:'',
            teacher:[],
            courseName:''
          },
          selectBy:[],
          deleteId:'',
          checked:'',
          receive:'',
          gradeVariable:''
      }
    },
    created(){
      this._init();
      this._getSession();
      this._getGrade();
      this._getTeacher();
      this._getPlace();
      this.selectFestivla();
      this.selectguobiao();
    },
    computed:{
      getFestivals(){
        if(this.festival){
          this.festival.forEach((item)=>{
            item.weekRModels.forEach((items)=>{
              if(this.selectBy !== null){
                this.selectBy.forEach((clazz)=>{
                  if(clazz.weekNum == items.weekId && clazz.sectionNum == items.festivalId){
                    items.course = clazz;
                  }
                })
              }
            });
          });
        }
        return this.festival;
      }

    },
    methods:{
      // 删除
      del(id){
        deleteCourse({fixedCourseId:id}).then((result)=>{
          if(result.status == 200){
            this.refrech();
            this.$notify({
              type:'success',
              message:'删除成功',
              title:'成功'
            });
            if(this.checked == 'clazz'){
              selectByClass({
                solutionId:this.solutionId,
                classId:this.receive.id
              }).then((res)=>{
                this.selectFestivla();
                this.selectBy = res.data;
              })
            }else if(this.checked == 'teacher'){
              selectByTeacher({
                solutionId:this.solutionId,
                teacherId:this.receive.id
              }).then((res)=>{
                this.selectFestivla();                
                this.selectBy = '';
                this.selectBy = res.data;
              })
            }else if(this.checked == 'place'){
              selectByPlace({
                solutionId:this.solutionId,
                placeId:this.receive.id
              }).then((res)=>{
                this.selectFestivla();                
                this.selectBy = [];       
                this.selectBy = res.data;
              })
            }else if(this.checked == 'grade'){
              selectByGrade({
                solutionId:this.solutionId,
                gradeId:this.receive.gradeId
              }).then((res)=>{
                this.selectFestivla();                
                this.selectBy = [];   
                this.selectBy = res.data;
              })
            }
          }
        })
      },

      // 刷新
      refrech(){
        this.selectFestivla();
        if(this.checked == 'clazz'){
          selectByClass({
            solutionId:this.solutionId,
            classId:this.receive.id
          }).then((res)=>{ 
            this.selectBy = res.data;
          });
          selectTableByClass({
            solutionId:this.solutionId,
            classId:this.receive.id
          }).then((result)=>{
            this.flag = 0;
            let arr = [];
            if(result.data == null){
              this.tableDataTopClass = [];
            }else{
              result.data.forEach((item)=>{
                if(item.fixedMergeClassVMS == null){
                  let obj = new Object();
                  obj.grade = item.gradeName;
                  obj.clazz = item.className;
                  obj.subject = item.courseName;
                  obj.sum = item.noFixed+'/'+item.sumSection;
                  obj.calculate = item.noFixed;
                  obj.foreignKeyId = item.foreignKeyId;
                  let str = '';
                  if(item.teacherNames !== null){
                    item.teacherNames.forEach((items)=>{
                      str += items + '、';
                    })
                  };
                  str = str.substr(0, str.length - 1);
                  obj.teacher = str;
                  arr.push(obj)
                }else if(item.fixedMergeClassVMS !==null){
                  let obj = new Object();
                  let str = ''
                  item.fixedMergeClassVMS.forEach((items)=>{
                    if(items.classShortName == null){
                      str += items.className + ',';
                    }else if(items.classShortName !== null){
                      str += items.classShortName + ',';
                    }
                  })
                  obj.clazz = str.substr(0,str.length - 1);
                  if(item.courseNames == null){
                    obj.subject = item.courseName;
                  }else if(item.courseNames !== null){
                    let st = '';
                    item.courseNames.forEach((items)=>{
                      st += items + '、' 
                    })
                    obj.subject = st.substr(0,st.length -1);
                  }
                  obj.sum = item.noFixed+'/'+item.sumSection;
                  obj.calculate = item.noFixed;
                  obj.foreignKeyId = item.foreignKeyId;
                  let strs = '';
                  if(item.teacherNames !== null){
                    item.teacherNames.forEach((items)=>{
                      strs += items + '、';
                    })
                  };
                  obj.teacher = strs.substr(0, strs.length - 1);
                  arr.push(obj);
                }
              });
            }
            this.tableDataTopClass = arr;
          });
        }else if(this.checked == 'teacher'){
          selectByTeacher({
            solutionId:this.solutionId,
            teacherId:this.receive.id
          }).then((res)=>{
            this.selectBy = '';
            this.selectBy = res.data;
          });
          selectTableByTeacher({
            solutionId:this.solutionId,
            teacherId:this.receive.id
          }).then((result)=>{
            if(result.data == null){
              this.tableDataTopTeacher = [];
            }else{
              this.flag = 2;
              let arr = [];
              result.data.forEach((item)=>{
                let obj = new Object();
                if(item.classId !== null){
                  obj.grade = item.gradeName;
                  obj.clazz = item.className;
                  obj.subject = item.courseName;
                  obj.courseId = item.courseId;
                  obj.sum = item.noFixed+'/'+item.sumSection;
                  obj.calculate = item.noFixed;
                  obj.foreignKeyId = item.foreignKeyId;
                }else if(item.classId == null){
                  obj.grade = '';
                  obj.subject = item.courseName;
                  obj.courseId = item.courseId;
                  obj.sum = item.noFixed+'/'+item.sumSection;
                  obj.calculate = item.noFixed;
                  obj.foreignKeyId = item.foreignKeyId;
                  let str = '';
                  item.fixedMergeClassVMS.forEach((items)=>{
                    if(items.classShortName == null){
                      str += items.className + ',';
                    }else if(items.classShortName !== null){
                      str += items.classShortName + ',';
                    }
                  })
                  obj.clazz = str.substr(0,str.length - 1);
                }
                arr.push(obj)
                this.tableDataTopTeacher = arr;
              }) 
            }
          })
        }else if(this.checked == 'place'){
          selectByPlace({
            solutionId:this.solutionId,
            placeId:this.receive.id
          }).then((res)=>{
            this.selectBy = [];       
            this.selectBy = res.data;
          });
            selectTableByPlace({
            solutionId:this.solutionId,
            placeId:this.receive.id
          }).then((result)=>{
            if(result.data.length == 0){
              this.tableDataTopPlace = [];
            }else{
              this.flag = 3;
              let arr = [];
              let str = '';
              result.data.forEach((item)=>{ 
                let obj = new Object();
                obj.grade = item.gradeName;
                if(item.fixedMergeClassVMS !== null){
                  item.fixedMergeClassVMS.forEach((items)=>{
                    if(items.classShortName !== null){
                      str += items.classShortName + '、';
                    }else if(items.classShortName == null){
                      str += items.className + '、';
                    }
                  })
                  obj.clazz = str.substr(0, str.length - 1);
                }else if(item.fixedMergeClassVMS == null){
                  obj.clazz = item.className;
                }
                obj.subject = item.courseName;
                obj.courseId = item.courseId;
                obj.sum = item.noFixed+'/'+item.sumSection;
                obj.calculate = item.noFixed;
                obj.foreignKeyId = item.foreignKeyId;
                let st = '';
                item.teacherNames.forEach((items)=>{
                  st += items+'、';
                })
                st = st.substr(0, st.length - 1);
                obj.teacher = st;
                arr.push(obj);
              })
              this.tableDataTopPlace = arr; 
            }
        
          });
        }else if(this.checked == 'grade'){
          selectByGrade({
            solutionId:this.solutionId,
            gradeId:this.receive.gradeId
          }).then((res)=>{
            this.selectBy = [];   
            this.selectBy = res.data;
          });
          selectTableByGrade({
            solutionId : this.solutionId,
            gradeId : this.gradeVariable.gradeId
          }).then((result)=>{
            if(result.data.length == 0){
              this.flag = 1;
              this.tableDataTopGrade = [{
                grade:'',
                subject:'',
                sum:''
              }];
            }else{
              this.flag = 1;
              let arr = [];
              result.data.forEach((item,index)=>{
                let obj = new Object;
                obj.grade = item.gradeName;
                obj.subject = item.courseName;
                obj.sum = item.noFixed+'/'+item.sumSection;
                obj.calculate = item.noFixed;
                obj.foreignKeyId = item.foreignKeyId;
                obj.courseId = item.courseId;
                arr.push(obj);
              });
              this.tableDataTopGrade = arr;
            }
          });
        }
      },

      //选中周内某一天某个节次
      checkDay(festival,week){
        if(this.courses.foreignKeyId){
          this.festival.forEach((item)=>{
            item.weekRModels.forEach((items)=>{
              if(items.festivalId == festival && items.weekId == week){
                if(items.course){
                  this.$notify({title: '警告', message: '请勿重复添加', type: 'warning'});
                }else{
                  this.courses.weekNum = week;
                  this.courses.sectionNum = festival;
                  this.saveFixcourse();
                }
              }
            })
          })    
        }else{
          this.$notify({title: '警告', message: '请先选择上表中课程', type: 'warning'});
        }
      },
      //初始化
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      //获取unitId
      _init() {
          let userMsg = this.$getSess('user');
          if (userMsg && userMsg.data ) {
              if (userMsg.data.unitId) {
                  this.unitId = userMsg.data.unitId;
              }
          }
      },
      // 获取solutionId
      _getSession() {
        let solution = this.$getSess('solutionId');
        if(solution){
          this.solutionId = solution;
        }
      },
      //根据solutionId获取年级
      _getGrade(){
        selectGradeBySolution(
          {solutionId:this.solutionId}
        ).then((result)=>{
          let arrGrade = [];
          arrGrade = result.data;
          result.data.forEach((item)=>{
            item.label = item.gradeName;
            item.children = [];
            getClassList({gradeId:item.gradeId}).then((res)=>{
              res.data.forEach((items)=>{
                items.label = items.name;
              })
              item.children = res.data;
            })
          })
          this.data[0].children = arrGrade;
        })
      },

      //根据solutionId获取教师
      _getTeacher(){
        selectCourseTeacherBySolution({
          solutionId:this.solutionId
          }).then((result)=>{
            let arrTeacher = [];
            result.data.forEach((item)=>{
              item.id = item.courseId;
              item.label = item.courseName;
              item.children = item.teacherVMS;
              item.teacherVMS.forEach((items)=>{
                items.id = items.teacherId;
                items.label = items.teacherName;
              })
            })
            this.data[1].children = result.data;
          })
      },

      //根据solutionId获取场地
      _getPlace(){
        findUnit({
          unitId:this.unitId
        }).then((result)=>{
          let arrPlace = [];
          arrPlace = result.data;
          result.data.forEach((item)=>{
            item.label = item.address;
          })
          this.data[2].children = arrPlace;
        })
      },

      getFirstTable(data){
        this.courses = {};
        this.receive = data;
        if(!data.children && data.jie && data.ji){
          this.checked = 'clazz';
          selectTableByClass({
            solutionId:this.solutionId,
            classId:data.id
          }).then((result)=>{
            this.flag = 0;
            let arr = [];
            if(result.data == null){
              this.tableDataTopClass = [];
            }else{
              result.data.forEach((item)=>{
                if(item.fixedMergeClassVMS == null){
                  let obj = new Object();
                  obj.grade = item.gradeName;
                  obj.clazz = item.className;
                  obj.subject = item.courseName;
                  obj.sum = item.noFixed+'/'+item.sumSection;
                  obj.calculate = item.noFixed;
                  obj.foreignKeyId = item.foreignKeyId;
                  let str = '';
                  if(item.teacherNames !== null){
                    item.teacherNames.forEach((items)=>{
                      str += items + '、';
                    })
                  };
                  str = str.substr(0, str.length - 1);
                  obj.teacher = str;
                  arr.push(obj)
                }else if(item.fixedMergeClassVMS !==null){
                  let obj = new Object();
                  let str = ''
                  item.fixedMergeClassVMS.forEach((items)=>{
                    if(item.classShortName == null){
                      str += item.className + ',';
                    }else if(item.classShortName !== null){
                      str += item.classShortName + ',';
                    }
                  })
                  obj.clazz = str.substr(0,str.length - 1);
                  if(item.courseNames == null){
                    obj.subject = item.courseName;
                  }else if(item.courseNames !== null){
                    let st = '';
                    item.courseNames.forEach((items)=>{
                      st += items + '、' 
                    })
                    obj.subject = st.substr(0,st.length -1);
                  }
                  obj.sum = item.noFixed+'/'+item.sumSection;
                  obj.calculate = item.noFixed;
                  obj.foreignKeyId = item.foreignKeyId;
                  let strs = '';
                  if(item.teacherNames !== null){
                    item.teacherNames.forEach((items)=>{
                      strs += items + '、';
                    })
                  };
                  obj.teacher = strs.substr(0, strs.length - 1);
                  arr.push(obj);
                }
              });
            }

            this.tableDataTopClass = arr;
          });
          selectByClass({
            solutionId:this.solutionId,
            classId:data.id
          }).then((res)=>{
            this.selectBy = res.data;
            this.refrech();
          })
        }else if(!data.children && data.teacherId){
          this.checked = 'teacher';
          selectTableByTeacher({
            solutionId:this.solutionId,
            teacherId:data.id
          }).then((result)=>{
            console.log(result,'教师下数据'); 
            if(result.data == null){
              this.tableDataTopTeacher = [];
            }else{
              this.flag = 2;
              let arr = [];
              result.data.forEach((item)=>{
                let obj = new Object();
                if(item.classId !== null){
                  obj.grade = item.gradeName;
                  obj.clazz = item.className;
                  obj.subject = item.courseName;
                  obj.courseId = item.courseId;
                  obj.sum = item.noFixed+'/'+item.sumSection;
                  obj.calculate = item.noFixed;
                  obj.foreignKeyId = item.foreignKeyId;
                }else if(item.classId == null){
                  obj.grade = '';
                  obj.subject = item.courseName;
                  obj.courseId = item.courseId;
                  obj.sum = item.noFixed+'/'+item.sumSection;
                  obj.calculate = item.noFixed;
                  obj.foreignKeyId = item.foreignKeyId;
                  let str = '';
                  item.fixedMergeClassVMS.forEach((items)=>{
                    if(items.classShortName == null){
                      str += items.className + ',';
                    }else if(items.classShortName !== null){
                      str += items.classShortName + ',';
                    }
                  })
                  obj.clazz = str.substr(0,str.length - 1);
                }
                arr.push(obj)
                this.tableDataTopTeacher = arr;
              }) 
            }

          });
          selectByTeacher({
            solutionId:this.solutionId,
            teacherId:data.id
          }).then((res)=>{
            this.selectBy = res.data;
            this.refrech();
          })
        }else if(!data.children && data.address){
          this.checked = 'place'
          selectTableByPlace({
            solutionId:this.solutionId,
            placeId:data.id
          }).then((result)=>{
            if(result.data.length == 0){
              this.tableDataTopPlace = [];
            }else{
              this.flag = 3;
              let arr = [];
              let str = '';
              result.data.forEach((item)=>{ 
                let obj = new Object();
                obj.grade = item.gradeName;
                if(item.fixedMergeClassVMS !== null){
                  item.fixedMergeClassVMS.forEach((items)=>{
                    if(items.classShortName !== null){
                      str += items.classShortName + '、';
                    }else if(items.classShortName == null){
                      str += items.className + '、';
                    }
                  })
                  obj.clazz = str.substr(0, str.length - 1);
                }else if(item.fixedMergeClassVMS == null){
                  obj.clazz = item.className;
                }
                obj.subject = item.courseName;
                obj.courseId = item.courseId;
                obj.sum = item.noFixed+'/'+item.sumSection;
                obj.calculate = item.noFixed;
                obj.foreignKeyId = item.foreignKeyId;
                let st = '';
                item.teacherNames.forEach((items)=>{
                  st += items+'、';
                })
                st = st.substr(0, st.length - 1);
                obj.teacher = st;
                arr.push(obj);
              })
              this.tableDataTopPlace = arr; 
            }
        
          });
          selectByPlace({
            solutionId:this.solutionId,
            placeId:data.id
          }).then((res)=>{
            this.selectBy = res.data;
            this.refrech();
          })
        }else if(data.children && data.gradeId){
          this.checked = 'grade';
          this.gradeVariable = data;
          selectTableByGrade({
            solutionId : this.solutionId,
            gradeId : data.gradeId
          }).then((result)=>{
            if(result.data.length == 0){
              this.flag = 1;
              this.tableDataTopGrade = [{
                grade:'',
                subject:'',
                sum:''
              }];
            }else{
              this.flag = 1;
              let arr = [];
              result.data.forEach((item,index)=>{
                let obj = new Object;
                obj.grade = item.gradeName;
                obj.subject = item.courseName;
                obj.sum = item.noFixed+'/'+item.sumSection;
                obj.calculate = item.noFixed;
                obj.foreignKeyId = item.foreignKeyId;
                obj.courseId = item.courseId;
                arr.push(obj);
              });
              this.tableDataTopGrade = arr;
            }
          });
          selectByGrade({
            solutionId:this.solutionId,
            gradeId:data.gradeId
          }).then((res)=>{
            this.selectBy = res.data;
            this.refrech();
          })
        }
      },

      // 点击行时触发事件
      rowClick(row,event,column){
        console.log(row);
        if(this.flag == 1){
          if(row.calculate == 0){
            this.$notify({title: '警告', message: '已无未排课程', type: 'warning'});
            this.courses = {};
          }else{
            this.courses.foreignKeyId = row.foreignKeyId;
            this.courses.courseId = row.courseId;
            let arr = [];
            arr.push(row.teacher);  
            this.courses.teacher =  arr;
            this.courses.courseName = row.subject;
          }
        }else if(this.flag == 2){
          if(row.calculate == 0){
            this.$notify({title: '警告', message: '已无未排课程', type: 'warning'});
            this.courses = {};
          }else{
            this.courses.foreignKeyId = row.foreignKeyId;
            this.courses.courseId = row.courseId; 
            let arr = [];          
            arr.push(row.teacher);  
            this.courses.teacher =  arr;
            this.courses.courseName = row.subject;
            }
        }else if(this.flag == 3){
          if(row.calculate == 0){
            this.$notify({title: '警告', message: '已无未排课程', type: 'warning'});
            this.courses = {};
          }else{
            this.courses.foreignKeyId = row.foreignKeyId;
            this.courses.courseId = row.courseId; 
            let arr = [];          
            arr.push(row.teacher);  
            this.courses.teacher =  arr;
            this.courses.courseName = row.subject;
          }
        }else if(this.flag == 0){
          if(row.calculate == 0){
            this.$notify({title: '警告', message: '已无未排课程', type: 'warning'});
            this.courses = {};
          }else{
            this.courses.foreignKeyId = row.foreignKeyId;
            this.courses.courseId = row.courseId; 
            let arr = [];     
            arr.push(row.teacher);  
            this.courses.teacher =  arr;
            this.courses.courseName = row.subject;     
          }    
        }
      },
      //查询节次列表
      selectFestivla(){
        selectFestivlaByUnit({unitId:this.unitId}).then((result)=>{
          console.log(result.data);
          //数据清洗
          let arr = result.data;
          arr.forEach((item)=>{
            let diff = 7 - item.weekRModels.length;
            if(diff > 0){
              for(var i=0;i<diff;i++){
                item.weekRModels.push({'flag':'disable'});
              }
            }
          });
          this.festival = arr;
        })
      },
      //根据类型查询国标
      selectguobiao(){
        selectGB().then((result)=>{
          this.guobiao = result.data;
        })
      },
      //保存固定课
      saveFixcourse(){
        save({
          solutionId:this.solutionId,
          foreignKeyId:this.courses.foreignKeyId,
          weekNum:this.courses.weekNum,
          sectionNum:this.courses.sectionNum
        }).then((result)=>{
          if(result.status == 200){
            this.$notify({
              type:'success',
              message:'保存成功',
              title:'成功'
            });
            this.refrech();
          }
        })
      },
      
      // 删除固定课
      deleteFixcourse(){
        deleteCourse({
          fixedCourseId:this.fixedCourseId
        }).then((res)=>{
        })
      }
    }
  }
</script>
<style scoped>
  .app-container-box {
    top:185px;
    bottom:50px;
  }
  .fixedCourse .search{
    padding-left: 15px;
  }
  .fixedCourse .search:after{
    content: "";
    display: block;
    clear: both;
  }
  .fixedCourse .search > div{
    float: left;
    height: 50px;
    line-height: 50px;
  }
  .fixedCourse .search > div:last-child{
    width: 70%;
  }

  .fixedCourse .bodyRight{
    overflow-y: scroll;
    position: absolute;
    top: 0;
    bottom:0;
    width: 100%;
  }

  .fixedCourse .bodyRight .topTb{
    padding-bottom: 30px;
    padding-right: 110px;
    background-color: rgb(238, 239, 246);
    margin-bottom: 16px;
  }
  .fixedCourse .bodyRight .topTb table{
    border-collapse: collapse;
    text-align: center;
    width: 100%;
    background-color: #FFFFFF;
  }

  .fixedCourse .bodyRight .topTb table td{
    border: 1px solid #ededed;
    height: 30px;
    line-height: 30px;
  }
  .tree-style{
    border: none;
    padding: 10px 20px;
  }
</style>
