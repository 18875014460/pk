<template>
	<div class="app-container-box">
		<sy-grad-4 v-if="isImport">
			<div slot="headerLeft" v-if="isHiddenTree">
				<span>组织架构</span>
			</div>
			<div slot="headerRight" class="line-height-56">
				<span>{{currentText}} 教师列表</span>
			</div>
			<div slot="bodyLeft" style="padding: 0;" v-if="isHiddenTree">
				<sy-grad-4 :border="false">
					<div slot="headerRight" class="line-height-56" style="background:#fff;">
						<el-input placeholder="请输入关键字" icon="search" v-model.trim="filterText" @keyup.enter.native="handleIconClick" size="small" :on-icon-click="handleIconClick">
						</el-input>
					</div>
					<div slot="bodyRight" style="padding: 0;">
						<el-tree :data="data" :props="defaultProps" :empty-text="emptyTreeText" ref="tree" node-key="id" style="border:0;" class="full-parent" :filter-node-method="filterNode" :current-node-key="currentNodeKey" :highlight-current="true" :default-expanded-keys="openArrList" @node-click="handleNodeClick">
						</el-tree>
					</div>
				</sy-grad-4>
			</div>
			<div slot="bodyRight" style="padding: 0;">
				<sy-grad-4 :border="false">
					<div slot="headerRight" class="line-height-56">
						<div class="sy-row">
							<div class="sy-col sy-10">
								<span style="fontSize:12px ;font-weight: normal;">关键字：</span>
								<el-input style="width:256px;" size="small" icon="search" v-model.trim="keyWords" :on-icon-click="handleSearchIconClick" @keyup.enter.native="handleSearchIconClick" placeholder="账号、姓名、手机、邮箱、身份证号">
								</el-input>
							</div>
							<div class="sy-col sy-10 right">
								<el-button type="" size="small" @click="handleRegisterDialog" v-if="codeList['btn_base_teacher_register']">注册</el-button>
								<el-button type="" size="small" @click="toImportMsg" v-if="codeList['btn_base_teacher_import']">导入</el-button>
								<!-- <el-button type="" size="small" @click="openSortingDialog">排序</el-button> -->
								<el-button type="" size="small" @click="handleDownLoadDialog" v-if="codeList['btn_base_teacher_download']">下载</el-button>
							</div>
						</div>
					</div>
					<div slot="bodyRight" style="height:100%;width:100%;padding:0px 10px;">
						<el-table ref="multipleTable" :data="tableData" border stripe :empty-text="emptyText" tooltip-effect="dark" height="100%" style="height:100%;width:100%;" @selection-change="handleSelectionChange">
							<el-table-column type="selection" :selectable="handleSelectable" width="55">
							</el-table-column>
							<el-table-column v-for="item in appColumn" :key="item.prop" :width="item.width" :align="item.align" :label="item.label">
								<template scope="scope">
									<span v-if="item.prop !== 'gender' && item.prop !== 'status' && codeList['btn_base_teacher_lock']">{{scope.row[item.prop]}}</span>
									<span v-if="item.prop === 'gender'">{{scope.row[item.prop] === 1 ? '男' : scope.row[item.prop] === 2 ? '女' : ''}}</span>
									<el-button type="text" @click="handleTeacherOpen(scope.row)" v-if="item.prop === 'status'">
										<i v-if="scope.row[item.prop] === 1" class="fa fa-toggle-on" aria-hidden="true" title="点击设置离校"></i>
										<i v-else class="fa fa-toggle-off" aria-hidden="true" title="点击设置在校"></i>
									</el-button>
								</template>
							</el-table-column>
							<el-table-column label="操作" width="150" align='center'>
								<template scope="scope">
									<el-button size="small" type="text" v-if="codeList['btn_base_teacher_update']" @click="handleEdit(scope.$index, scope.row)">
										<i class="fa fa-pencil-square-o" title="编辑" v-if="codeList['btn_base_teacher_update']"></i>
									</el-button>
									<el-button size="small" type="text" v-if="codeList['btn_base_teacher_showPer']" @click="handleAuthority(scope.$index, scope.row)">
										<i class="fa fa-eye" aria-hidden="true" title="查看权限" v-if="codeList['btn_base_teacher_showPer']"></i>
									</el-button>
									<el-button size="small" type="text" v-if="codeList['btn_base_teacher_lock']" @click="handleClearMsg(scope.$index, scope.row)">
										<i class="fa fa-eraser" aria-hidden="true" title="清除登录错误信息"></i>
									</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
					<div slot="footer" class="left">
						<el-button type="" size="small" :disabled="multipleSelection.length === 0" @click="openDelegateDialog" v-if="codeList['btn_base_teacher_delegate']">委派</el-button>
						<el-button type="danger" :loading="deleteBtn" size="small" :disabled="multipleSelection.length === 0" @click="handleDelegateTeacher" v-if="codeList['btn_base_teacher_logout']">注销</el-button>
						<el-pagination @current-change="handleCurrentChange" :current-page="listParmars.start" :page-size="listParmars.size" class="pagination-mf" layout="total, prev, pager, next" :total="totals">
						</el-pagination>
					</div>
				</sy-grad-4>
			</div>
		</sy-grad-4>
		<!-- 角色委派 -->
		<sy-dialog title="角色委派" :close-on-click-modal="false" position="middle" height="auto" width="360px" slide="fade" :visible.sync="delegateDialog">
			<div slot="body" style="padding:10px;">
				<el-table :data="delegateData" ref="multipleTable1" border stripe v-loading="loadingRole" @selection-change="handleSelectionChange1" :height="delegateData.length>10 ? '400' : ''" style="width: 100%">
					<el-table-column type="selection" width="55">
					</el-table-column>
					<el-table-column prop="name" label="角色">
					</el-table-column>
					<el-table-column prop="memo" label="角色描述">
					</el-table-column>
				</el-table>
			</div>
			<div slot="footer">
				<el-button type="" @click="delegateDialog = false" size="small">取消</el-button>
				<el-button type="primary" :loading="authBtn" @click="handleDelegateDialog" size="small">确定</el-button>
			</div>
		</sy-dialog>
		<!-- 注册 -->
		<sy-dialog title="注册" :close-on-click-modal="false" position="middle" width="570px" height="auto" slide="fade" :visible.sync="registerDialog">
			<div slot="body" style="padding:10px 20px 10px 10px;">
				<el-form label-position="right" label-width="95px" ref="registerForm" :rules="registerFormRules" :model="registerForm">
					<el-row :gutter="0">
						<el-col :span="12">
							<div class="register-form">
								<el-form-item label="账号：" prop="loginName">
									<el-input v-model.trim="registerForm.loginName"></el-input>
								</el-form-item>
								<el-form-item label="姓名：" prop="realName">
									<el-input v-model.trim="registerForm.realName"></el-input>
								</el-form-item>
								<el-form-item label="密码：" prop="password">
									<el-input v-model.trim="registerForm.password" type=""></el-input>
								</el-form-item>
							</div>
						</el-col>
						<el-col :offset="2" :span="10" style="height:136px;">
							<el-upload class="avatar-uploader" :action="imgUrl" :data="uploaddata" name="fileUpload" v-loading="imgloading" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
								<div class="avatar-content">
									<img :src="showImgUrl" class="avatar-img">
								</div>
								<p>上传照片【28.6mm*38.1mm】</p>
							</el-upload>
						</el-col>
					</el-row>
					<el-row :gutter="0">
						<el-col :span="12">
							<el-form-item label="性别：" prop="gender">
								<el-select v-model="registerForm.gender" placeholder="请选择" style="width:100%;">
									<el-option v-for="item in genderOptions" :key="item.value + 'gneder'" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="序号：" prop="sort">
								<el-input v-model="registerForm.sort" type=""></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="0">
						<el-col :span="12">
							<div class="register-form">
								<el-form-item label="身份证号：" prop="identificationNumber">
									<el-input v-model.trim="registerForm.identificationNumber"></el-input>
								</el-form-item>
								<el-form-item label="电子邮箱：" prop="loginEmail">
									<el-input v-model.trim="registerForm.loginEmail"></el-input>
								</el-form-item>
								<el-form-item label="所属部门：">
									<el-select v-model="department" multiple no-data-text="该单位下没有部门" placeholder="请选择" style="width:100%;">
										<el-option v-for="item in departmentOptions" :key="item.value + 'department'" :label="item.label" :value="item.value">
											<span style="float: left" :style="{'padding-left': (item.cen-1)*15 + 'px'}">
												{{ item.label }}
											</span>
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="所属学科：" v-if="isJUJ">
									<el-select v-model="subject" multiple no-data-text="该单位下没有学科" placeholder="请选择" style="width:100%;">
										<!-- <el-collapse v-model="activeNames">
	                      <el-collapse-item v-for="(item,i) in subjectOptions" :key="item.value + 'subject'" :title="item.name" :name="i+1">
	                        <el-option
	                          v-for="child in item.children"
	                          :key="child.id + 'child'"
	                          :label="child.name"
	                          :value="child.id">
	                          <span>{{ child.name }}</span>
	                        </el-option>
	                      </el-collapse-item>
	                      
	                    </el-collapse> -->
										<el-option v-for="item in subjectOptions" :key="item.value + 'subject'" :label="item.label" :disabled="item.disabled" :value="item.value">
											<span style="float: left" :style="{'padding-left': (item.cen-1)*15 + 'px'}">
												{{ item.label }}
											</span>
										</el-option>
									</el-select>
								</el-form-item>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="register-form">
								<el-form-item label="手机号：" prop="loginMobile">
									<el-input v-model.trim="registerForm.loginMobile"></el-input>
								</el-form-item>
								<el-form-item label="考勤号：" prop="pin">
									<el-input v-model.trim="registerForm.pin" placeholder=""></el-input>
								</el-form-item>
								<el-form-item label="所属年级：" v-if="isJUJ">
									<el-select v-model="addGrade" multiple no-data-text="该单位下没有年级" placeholder="请选择" style="width:100%;">
										<el-option v-for="item in gradeOptions" :key="item.value + 'grade'" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="荣誉称号：">
									<el-select v-model="registerForm.rych" placeholder="请选择" style="width:100%;">
										<el-option v-for="item in honoraryTitleOptions" :key="item.value + 'honoraryTitle'" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<div class="register-form">
								<el-form-item label="家庭住址：" prop="address">
									<el-input v-model.trim="registerForm.address" type="textarea" resize="none" :rows="2"></el-input>
								</el-form-item>
							</div>
						</el-col>
					</el-row>

				</el-form>
			</div>
			<div slot="footer">
				<el-button type="" @click="registerDialog = false" size="small">取 消</el-button>
				<el-button type="primary" :loading="addNewBtn" @click="submitNewUser('registerForm')">确 定</el-button>
			</div>
		</sy-dialog>
		<!-- 排序 -->
		<sy-dialog title="排序" :close-on-click-modal="false" position="middle" height="auto" width="500px" slide="fade" :visible.sync="sortingDialog">
			<div slot="body" style="padding:10px;">
				<el-table :data="sortingData" max-height="400" border>
					<el-table-column prop="account" label="账号">
					</el-table-column>
					<el-table-column prop="name" label="姓名">
					</el-table-column>
					<el-table-column label="序号">
						<template scope="scope">
							<el-input size="mini" placeholder="请输入序号" v-model.trim="scope.row.sort">
							</el-input>
						</template>
					</el-table-column>
				</el-table>
			</div>
			<div slot="footer">
				<el-button type="" @click="sortingDialog = false" size="small">取 消</el-button>
				<el-button type="primary" @click="saveSortingDialog">保 存</el-button>
			</div>
		</sy-dialog>
		<!-- 用户下载 -->
		<sy-dialog title="用户下载" :close-on-click-modal="false" position="middle" height="auto" width="500px" slide="fade" :visible.sync="downLoadDialog">
			<div slot="body" style="padding:10px;">
				<el-form ref="downLoadForm" :model="downLoadForm" label-width="130px" label-position="left">
					<el-form-item label="选择要下载的部门:">
						<el-select v-model="downLoadForm.departmentId" placeholder="不选默认为当前单位下所有部门" style="width:100%;">
							<el-option v-for="item in departmentOptions" :key="item.value + 'department1'" :label="item.label" :value="item.value">
							</el-option>
						</el-select>
					</el-form-item>
					<el-form-item label="选择要下载的字段:">
						<div class="border">
							<el-checkbox-group v-model="downLoadForm.downloadOptions">
								<el-checkbox v-for="item in downloadDatas" :label="item.value" :checked="item.isSelected" :disabled="item.isSelected" :key="item.label" style="marginLeft:5px;">
									{{item.label}}
								</el-checkbox>
							</el-checkbox-group>
						</div>

					</el-form-item>
				</el-form>
			</div>
			<div slot="footer">
				<el-button type="" @click="downLoadDialog = false" size="small">取 消</el-button>
				<el-button type="primary" @click="downLoad">导 出</el-button>
			</div>
		</sy-dialog>
		<!-- 用户权限 -->
		<sy-dialog title="用户权限" :close-on-click-modal="false" position="middle" height="50%" width="400px" slide="fade" :visible.sync="authorityDialog">
			<div slot="body" style="height:100%;">
				<el-tree :data="authData" style="border:0;" :empty-text="emptyauthText" :props="defaultProps"></el-tree>
			</div>
		</sy-dialog>
		<!-- 编辑 -->
		<sy-dialog title="编辑" :close-on-click-modal="false" position="middle" height="auto" width="570px" slide="fade" :visible.sync="editorDialog">
			<div slot="body" style="padding:10px 20px 10px 10px;" v-loading="loading">
				<el-form label-position="right" label-width="95px" ref="editForm" :rules="registerFormRules" :model="editForm">
					<el-row :gutter="20">
						<el-col :span="12">
							<div class="register-form">
								<el-form-item label="账号：" prop="loginName">
									<el-input v-model.trim="editForm.loginName" disabled></el-input>
								</el-form-item>
								<el-form-item label="姓名：" prop="realName">
									<el-input v-model.trim="editForm.realName"></el-input>
								</el-form-item>
								<el-form-item label="密码：" prop="password">
									<el-input v-model.trim="editForm.password" :type="ispassword" @focus="passwordOnFocus"></el-input>
								</el-form-item>
							</div>
						</el-col>
						<el-col :offset="2" :span="10" style="height:136px;">
							<el-upload class="avatar-uploader" :action="imgUrl" name="fileUpload" :data="uploaddata" v-loading="imgloading" :show-file-list="false" :on-success="handleAvatarSuccess1" :before-upload="beforeAvatarUpload">
								<div class="avatar-content">
									<img :src="editImgUrl" class="avatar-img">
								</div>
								<p>上传照片【28.6mm*38.1mm】</p>
							</el-upload>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<el-form-item label="性别：" prop="gender">
								<el-select v-model="editForm.gender" placeholder="请选择" style="width:100%;">
									<el-option v-for="item in genderOptions" :key="item.value + 'gneder'" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="序号：" prop="sort">
								<el-input v-model="editForm.sort" type=""></el-input>
							</el-form-item>
						</el-col>
					</el-row>
					<el-row :gutter="20">
						<el-col :span="12">
							<div class="register-form">
								<el-form-item label="身份证号：" prop="identificationNumber">
									<el-input v-model.trim="editForm.identificationNumber"></el-input>
								</el-form-item>
								<el-form-item label="电子邮箱：" prop="loginEmail">
									<el-input v-model.trim="editForm.loginEmail"></el-input>
								</el-form-item>
								<el-form-item label="所属部门：">
									<el-select v-model="department" multiple no-data-text="该单位下没有部门" placeholder="请选择" style="width:100%;">
										<el-option v-for="item in departmentOptions" :key="item.value + 'department'" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="所属学科：" v-if="isJUJ">
									<el-select v-model="subject" @remove-tag="removeSubjectTage" multiple no-data-text="该单位下没有学科" placeholder="请选择" style="width:100%;">
										<el-option v-for="item in subjectOptions" :key="item.value + 'subject'" :label="item.label" :disabled="item.disabled" :value="item.value">
											<span style="float: left" :style="{'padding-left': (item.cen-1)*20 + 'px'}">{{ item.label }}</span>
										</el-option>
									</el-select>
								</el-form-item>
							</div>
						</el-col>
						<el-col :span="12">
							<div class="register-form">
								<el-form-item label="手机号：" prop="loginMobile">
									<el-input v-model.trim="editForm.loginMobile"></el-input>
								</el-form-item>
								<el-form-item label="考勤号：" prop="pin">
									<el-input v-model.trim="editForm.pin"></el-input>
								</el-form-item>
								<el-form-item label="所属年级：" v-if="isJUJ">
									<el-select v-model="grade" @remove-tag="removeGradeTage" multiple no-data-text="该单位下没有年级" placeholder="请选择" style="width:100%;">
										<el-option v-for="item in gradeOptions" :key="item.value + 'grade'" :disabled="item.disabled" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
								<el-form-item label="荣誉称号：">
									<el-select v-model="editForm.rych" placeholder="请选择" style="width:100%;">
										<el-option v-for="item in honoraryTitleOptions" :key="item.value + 'honoraryTitle'" :label="item.label" :value="item.value">
										</el-option>
									</el-select>
								</el-form-item>
							</div>
						</el-col>
					</el-row>
					<el-row>
						<el-col :span="24">
							<div class="register-form">
								<el-form-item label="家庭住址：" prop="address">
									<el-input v-model.trim="editForm.address" type="textarea" resize="none" :rows="2"></el-input>
								</el-form-item>
							</div>
						</el-col>
					</el-row>
					<!-- <div class="center">
	              <el-button @click="submitUpdata('editForm')">确 定</el-button>
	          </div> -->
				</el-form>
			</div>
			<div slot="footer">
				<el-button type="" @click="editorDialog = false" size="small">取 消</el-button>
				<el-button type="primary" :loading="editBtn" @click="submitUpdata('editForm')">确 定</el-button>
			</div>
		</sy-dialog>
	</div>
</template>

<script>
import teacher from './teacher.js';
import data from '../data.js';
export default {
	mixins: [teacher, data]
}
</script>

<style scoped>
.teacher-content,
.teacher {
	position: relative;
	height: 100%;
	width: 100%;
	box-sizing: border-box;
	padding: 30px 20px;
}

.teacher-content {
	padding: 0;
}

.teacher-content-top {
	position: absolute;
	height: 30px;
	top: 0;
	width: 100%;
	line-height: 30px;
}

.teacher-content-bottom {
	position: absolute;
	top: 30px;
	bottom: 0;
	width: 100%;
}

.avatar-uploader {
	border: 1px solid #ddd;
	border-radius: 2px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	margin: 0 auto;
	width: 100%;
	height: 100%;
	text-align: center;
}

.avatar-uploader p {
	position: absolute;
	font-size: 12px;
	height: 30px;
	line-height: 30px;
	padding: 0;
	margin: 0;
	z-index: 10;
	bottom: 0;
	left: 0;
	width: 100%;
}

.avatar-uploader-icon {
	font-size: 28px;
	color: #8c939d;
	text-align: center;
	width: 100px;
	height: 100px;
	line-height: 100px;
}

.avatar-content {
	position: absolute;
	overflow: hidden;
	top: 10px;
	left: 10px;
	right: 10px;
	bottom: 30px;
}

.avatar-img {
	height: 100%;
}

.register-form {
	text-align: center;
}

.open-hide {
	position: absolute;
	top: 40%;
	left: 0;
	cursor: pointer;
	z-index: 500;
}

.border {
	border: 1px solid #ddd;
}
</style>
