<template>
	<div class="sy-pk-step-site-box sy-theme-tableBorder">
		<sy-grad-4>
			<div slot="headerLeft" v-if="isShowLeft">
				<span>单位</span>
			</div>
			<div slot="headerRight" style="line-height:40px">
				<span>场地设置</span>
			</div>
			<div slot="bodyLeft" v-if="isShowLeft" style="background:#fff;">
				<sy-grad-4 :border="false">
					<div slot="headerRight" class="line-height-56" style="background:#fff;">
						<el-input placeholder="输入关键字进行过滤"  icon="search" v-model="filterText" @keyup.enter.native="handleIconClick" :on-icon-click="handleIconClick">
						</el-input>
					</div>
					<div slot="bodyRight">
						<el-tree
							:data="treeData"
							:default-expanded-keys="[selectTreeNodeId]"
							:current-node-key="selectTreeNodeId"
							highlight-current
							:props="defaultProps"
							node-key="unitId"
							class="full-parent"
							:filter-node-method="filterNode"
							@node-click="handleNodeClick"
							ref="tree">
						</el-tree>
					</div>
				</sy-grad-4>
			</div>
			<div slot="bodyRight">
					<!--场地类型-->
				<div v-show="!showTable">
					<sy-grad-4 :border="false">
						<div slot="headerRight" class="headerRight siteType">
							<div class="sy-row">
								<div class="sy-col sy-20 right" style="margin:5px 0px 5px 0px;">
									<el-button @click="addSiteType" v-if="codeList['btn_base_place_type_add']">新增</el-button>
								</div>
							</div>
						</div>
						<div slot="bodyRight" style="width: 100%;height: 100%; padding: 0 10px 10px;">
								<el-table ref="multipleTable" :data="siteData1"  border height="100%" border tooltip-effect="dark" style="width: 100%;height: 100%;">
									<el-table-column v-for="item in appColumn" :key="item.prop" :width="item.width" :label="item.label">
										<template scope="scope">
											<span v-if="item.prop !== 'sex' && item.prop !== 'status'">{{scope.row[item.prop]}}</span>
											<span v-if="item.prop === 'sex'">{{scope.row[item.prop] === 0 ? '男' : '女'}}</span>
											<span v-if="item.prop === 'status'">{{scope.row[item.prop] === 0 ? '禁用' : '启用'}}</span>
										</template>
									</el-table-column>
									<el-table-column label="操作" align="center" width="180">
										<template scope="scope">
											<i class="fa fa-cogs" v-if="codeList['page_base_place_place']" aria-hidden="true" title="维护场地" style="cursor:pointer;" @click="saveSite(scope.$index, scope.row)"></i>
											<!--实现一个跳转效果-->
											<i class="fa fa-pencil-square-o" v-if="codeList['btn_base_place_type_update']" title="修改" style="cursor:pointer;margin: 0 8px;" @click="handleSiteEdit(scope.$index, scope.row)"></i>
											<i class="el-icon-delete" v-if="codeList['btn_base_place_type_delete']" title="删除" style="cursor:pointer;" @click="handleDelete(scope.$index, scope.row)"></i>
										</template>
									</el-table-column>
								</el-table>
						</div>
					</sy-grad-4>
				</div>
				<!--场地列表-->
				<div v-show="showTable">
					<sy-grad-4 :border="false">
						 <div slot="headerRight" class="right" style="padding-top:6px;">
							 	<el-button  @click="importSite" v-if="codeList['btn_place_import']">导入</el-button>
								<el-button  @click="backSiteType">返回</el-button>
								<el-button  @click="addSiteVal"  v-if="codeList['btn_base_place_place_add']">新增</el-button>
						 </div>
					    <div slot="bodyRight">
							<div class="full-parent-height">
						    	<el-table ref="multipleTable" :data="siteData2" border height="100%" style="width:100%;height:100%" tooltip-effect="dark" @selection-change="handleSelectionChange">
									<el-table-column type="selection" width="55"></el-table-column>
									<el-table-column v-for="item in appColumn2" :key="item.prop" :width="item.width" :label="item.label">
										<template scope="scope">
											<span v-if="item.prop !== 'sex' && item.prop !== 'status'">{{scope.row[item.prop]}}</span>
											<span v-if="item.prop === 'sex'">{{scope.row[item.prop] === 0 ? '男' : '女'}}</span>
											<span v-if="item.prop === 'status'">{{scope.row[item.prop] === 0 ? '禁用' : '启用'}}</span>
										</template>
									</el-table-column>
									<el-table-column label="操作" align="center" width="140">
										<template scope="scope">
											<i class="fa fa-pencil-square-o" v-if="codeList['btn_base_place_place_update']" title="修改" style="cursor:pointer;" @click="handleSitesEdit(scope.$index, scope.row)"></i>
											<i class="el-icon-delete" v-if="codeList['btn_base_place_place_delete']" title="删除" style="cursor:pointer;marginLeft:8px;" @click="handleSiteDelete(scope.$index, scope.row)"></i>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</div>
					    <div slot="footer">
							<el-button type="danger"  @click="DeleteTableSite" :disabled="this.sels.length===0">删除</el-button>
							<el-pagination class="pagination-mf"
								@current-change="handleCurrentChange"
								:current-page="currentPage"
								 :page-size="pageSize"
								 layout="total, prev, pager, next"
								 :total='total'>
							</el-pagination>
					    </div>
					</sy-grad-4>
			    </div>
		</div>
		</sy-grad-4>
		<sy-dialog title="新增" :visible.sync="dialogSiteFormVisible" :close-on-click-modal="false" position="middle" height="auto" width="40%" slide="fade">
			<div slot="body" style="height: auto">
				<el-form label-width="120px" style="height:auto; margin:10px 10px 0 0" :rules="rules" ref="addSiteForm" :model="addSiteForm">
					<el-row>
						<el-col :span="15">
							<el-form-item label="场地类型名称：" prop="name">
								<el-input v-model="addSiteForm.name"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="9">
							<el-form-item label="序号：" prop="sort" labelWidth="70px">
								<el-input v-model="addSiteForm.sort"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="场地说明：" prop="memo">
								<el-input
								  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 5}"
								  placeholder="请输入内容"
								  v-model="addSiteForm.memo">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
                <el-button @click="dialogSiteFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="addSiteTypeList">确 定</el-button>
            </span>
		</sy-dialog>

		<!--修改场地类型-->
		<sy-dialog title="修改" :visible.sync="editorSiteDialog" :close-on-click-modal="false" position="middle" height="auto" width="40%" slide="fade">
			<div slot="body">
				<el-form label-position="right" label-width="120px" style="margin:20px 20px 0 10px" :rules="rulesing" ref="editSiteForm" :model="editSiteForm">
					<el-row>
						<el-col :span="12">
							<el-form-item label="场地类型名称：" prop="name">
								<el-input v-model="editSiteForm.name"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="序号：" prop="sort">
								<el-input v-model="editSiteForm.sort"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="场地描述：" prop="memo">
								<el-input
								  type="textarea"
								  :rows="2"
								  placeholder="请输入内容"
								  v-model="editSiteForm.memo">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editorSiteDialog = false">取 消</el-button>
                <el-button type="primary" @click="editSiteSubmit">确 定</el-button>
            </span>
		</sy-dialog>
		<!--新增场地-->
		<sy-dialog title="新增" :visible.sync="dialogSitedFormVisible" :close-on-click-modal="false" position="middle" height="auto" width="40%" slide="fade" size="small">
			<div slot="body">
				<el-form label-width="100px" style="margin-top:20px;margin-right:20px" :rules="rulesSite" ref="addSitesForm" :model="addSitesForm">
					<el-row>
						<el-col :span="12">
							<el-form-item label="场地名称：" prop="name">
								<el-input v-model="addSitesForm.name"></el-input>
							</el-form-item>
							<el-form-item label="序号：" prop="sort">
								<el-input v-model="addSitesForm.sort"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="场地地址：" prop="address">
								<el-input v-model="addSitesForm.address"></el-input>
							</el-form-item>
							<el-form-item label="容纳人数：" prop="capacity">
								<el-input v-model="addSitesForm.capacity"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24">
								<el-form-item label="场地说明：" prop="memo">
									<el-input
									  type="textarea"
									  :rows="2"
									  placeholder="请输入内容"
									  v-model="addSitesForm.memo">
									</el-input>
							</el-form-item>

						</el-col>
					</el-row>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
                <el-button @click="dialogSitedFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitAddSite">确 定</el-button>
            </span>
		</sy-dialog>
		<!--修改场地设置-->
		<sy-dialog title="修改" :visible.sync="editorSitesDialog" :close-on-click-modal="false" position="middle" height="auto" width="40%" slide="fade" size="small">
			<div slot="body">
				<el-form label-position="right" style="margin:20px 20px 0 0" :rules="rulesSited" ref="editSitesForm" label-width="100px" :model="editSitesForm">
					<el-row>
						<el-col :span="12">
							<el-form-item label="场地名称：" prop="name">
								<el-input v-model="editSitesForm.name"></el-input>
							</el-form-item>
							<el-form-item label="序号：" prop="sort">
								<el-input v-model="editSitesForm.sort"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="12">
							<el-form-item label="场地地址：" prop="address">
								<el-input v-model="editSitesForm.address"></el-input>
							</el-form-item>
							<el-form-item label="容纳人数：" prop="capacity">
								<el-input v-model="editSitesForm.capacity"></el-input>
							</el-form-item>
						</el-col>
						<el-col :span="24">
							<el-form-item label="场地描述：" prop="memo">
								<el-input
								  type="textarea"
								  :rows="2"
								  placeholder="请输入内容"
								  v-model="editSitesForm.memo">
								</el-input>
							</el-form-item>
						</el-col>
					</el-row>
				</el-form>
			</div>
			<span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editorSitesDialog = false">取 消</el-button>
                <el-button type="primary" @click="submitSiteList">确 定</el-button>
            </span>
		</sy-dialog>
	</div>
</template>

<script>
	import { getUnitTree,
			getSiteType,
			deleteSiteType,
			addSiteType,
			editSiteType,
			editSiteTypeNameVif,
			verificationSiteTypeName,
			verifiEditSiteTypeName,
			getSiteList,addSite,
			editSiteVif,editSite,
			deleteSiteList,
			batchRemoveSiteList,
			verifiAddSiteName,
			verifiAddSiteAddress,
			verifiEditSiteName,
			verifiEditSiteAddress} from '../require';
	import config from './config.js';
	import { getRcCodeList } from '../../request.js';
	import pager from '../../config.js';
	export default {
		data() {
			//新增场地类型
			let vifSiteTypeName = (rule, value, callback) => {
				if(value != undefined || value.length > 0){
					if(value.trim().length!=0){
						if(value.length > 50){
							callback(new Error("类型名称长度不能超过50字符"));
						}
					}else{
						callback(new Error("场地类型名称不能为空"));
					}

				}else{
					callback();
				}
				//提交前需要判断你的单位名称是否为空
				if(value == undefined || value.length == 0){
					callback(new Error("场地类型名称不能为空"));
					return false;
				}
				let para={
					"name":value,
					"unitId":this.unitId
				}
				verificationSiteTypeName(para).then((res) => {
					if(res.data){
						callback(new Error("场地类型名称重复"));
						return false;
					}
					callback();
				});
			};
			//修改场地类型
			let vifEditSiteTypeName = (rule, value, callback) => {
				if(value != undefined || value.length > 0){
					if(value.trim().length!=0){
						if(value.length > 50){
						callback(new Error("类型名称长度不能超过50字符"));
						}
					}else{
						callback(new Error("场地类型名称不能为空"));
					}

				}else{
					callback();
				}
				//提交前需要判断你的单位名称是否为空
				if(value == undefined || value.length == 0){
					callback(new Error("场地类型名称不能为空"));
					return false;
				}
				//在修改里面需要判断为修改前的数据还是修改后的数据
				if(this.editSiteForm.oldTypeName == value){
					callback();
					return;
				}
				let para={
					"id":this.siteTypeId,
					"name":value,
					"unitId":this.unitId
				}
				verifiEditSiteTypeName(para).then((res) => {
					if(res.data){
						callback(new Error("场地类型名称重复"));
						return false;
					}
					callback();
				});
			};
			//新增场地
			let vifAddSiteName= (rule, value, callback) => {
				if(value != undefined || value.length > 0){
					if(value.trim().length!=0){
						if(value.length > 50){
							callback(new Error("场地名称长度不能超过50字符"));
						}
					}else{
						callback(new Error("场地名称不能为空"));
					}

				}else{
					callback();
				}
				//提交前需要判断你的单位名称是否为空
				if(value == undefined || value.length == 0){
					callback(new Error("场地名称不能为空"));
					return false;
				}
				let para={
					"placeTypeId":this.siteId,
					"name":value
				}
				verifiAddSiteName(para).then((res) => {
					if(res.data){
						callback(new Error("场地名称重复"));
						return false;
					}
					callback();
				});
			};
			//新增场地地址
			let vifAddSiteAddress= (rule, value, callback) => {
				//提交前需要判断你的单位名称是否为空
				if(value == undefined || value.length == 0){
					callback(new Error("场地地址不能为空"));
					return false;
				}
				if(value != undefined || value.length > 0){
					if(value.trim().length != 0){
						if(value.length > 200){
								callback(new Error("场地地址长度不能超过200"));
							}else{
								let para={
									"address":this.addSitesForm.address,
									"unitId":this.unitId,
								}
								verifiAddSiteAddress(para).then((res) => {
									if(res.data){
										callback(new Error("场地地址名称重复"));
										return false;
									}
									callback();
								});
							}
					}else{
						callback(new Error("场地地址不能为空"));
					}
				}else{
					callback();
				}

			};
			//修改场地
			let vifEditSiteName= (rule, value, callback) => {
				if(value != undefined || value.length > 0){
					if(value.trim().length !=0){
						if(value.length > 50){
						callback(new Error("场地名称长度不能超过50字符"));
						}
					}else{
						callback(new Error("场地名称不能为空"));
					}

				}else{
					callback();
				}
				//提交前需要判断你的单位名称是否为空
				if(value == undefined || value.length == 0){
					callback(new Error("场地名称不能为空"));
					return false;
				}
				//在修改里面需要判断为修改前的数据还是修改后的数据
				if(this.editSitesForm.oldName == value){
					callback();
					return;
				}
				let para={
					"placeTypeId":this.siteId,
					"name":value,
					"id":this.rowId
				}
				verifiEditSiteName(para).then((res) => {
					if(res.data){
						callback(new Error("场地名称重复"));
						return false;
					}
					callback();
				});
			};
			//修改场地地址
			let vifEditSiteAddress= (rule, value, callback) => {
				//提交前需要判断你的单位名称是否为空
				if(value == undefined || value.length == 0){
					callback(new Error("场地地址不能为空"));
					return false;
				}
				if(value !=undefined || value.length >0){
					if(this.editSitesForm.oldAddress == value){
						callback();
						return;
					}
					if(value.trim().length != 0){
						if(value.length > 200){
							callback(new Error("场地地址长度不能超过200"));
						}else{
							let para={
								"id":this.rowId,
								"address":this.editSitesForm.address,
								"unitId":this.unitId
							}
							verifiEditSiteAddress(para).then((res) => {
								if(res.data){
									callback(new Error("场地地址重复"));
									return false;
								}
								callback();
							});
						}
					}else{
						callback(new Error("场地地址不能为空"));
					}

				}else{
					callback();
				}

			};
			//场地类型说明
			let vifSiteMemo= (rule, value, callback) => {
				if(value != undefined && value.length >0){
					if(value.length > 200){
						callback(new Error("场地说明不能超过200"));
						return ;
					}
					callback();
				}else{
					callback();
				}
			};
			//序号
			let vifSiteNum = (rule, value, callback) => {
				 	let n = /^\d+$/;
			        if(value){
			        	if (n.test(value)){
		         	 		if(value <=0 || value > 9999){
			        			callback(new Error("序号的范围在1~9999"));
					        }else{
					        	callback();
					        }
				        }else{
				          	callback(new Error("请输入正确的数字"));
				        }

			        }else{
		        		callback();
			        }

				};
				let vifAddSiteCapacity= (rule, value, callback) => {
						let n = /^\d+$/;
			        if(value){
			        	if (n.test(value)){
		         	 		if(value>99999){
			        			callback(new Error("容纳人数不能超过99999"));
					        }else{
					        	callback();
					        }
				        }else{
				          	callback(new Error("请输入正确的数字"));
				        }

			        }else{
		        		callback();
			        }
				};
			return {
				isvisible_head:true,
				dialogSiteFormVisible: false,
				editorSiteDialog: false,
				dialogSitedFormVisible:false,
            	editorSitesDialog:false,
            	selectTreeNodeId:'',
				form: {
					text: ''
				},
				filterText: '',
				addSiteForm: {
					name: '',
					memo:'',
					sort:'',
					unitId:''
				},
				editSiteForm: {
					name: '',
					id:'',
					sort:'',
					memo:'',
					oldTypeName:'',
					oldSort:'',
					oldMemo:''
				},
				currentPage:1,
				total:0,
				pageSize: pager.pageSize,
				siteData1: [],
				siteData2: [],
				treeData:[],
				unitId:'',
				siteId:'',//场地类型id
				rowId:'',//场地列表id
				isShowLeft:false,
				showTable: false,
				appColumn: config.siteList1,
				appColumn2: config.siteList2,
				sels: [],
				//新增场地类型
				rules:{
					name:[
						{required: true,validator:vifSiteTypeName,trigger: 'blur'}
					],
					memo:[
						{validator:vifSiteMemo,trigger: 'blur'}
					],
					sort:[
						{validator:vifSiteNum,trigger: 'blur'}
					]
				},
				//修改场地类型
				rulesing: {
					name:[
						{required: true,validator:vifEditSiteTypeName,trigger: 'blur'}
					],
					memo:[
						{validator:vifSiteMemo,trigger: 'blur'}
					],
					sort:[
						{validator:vifSiteNum,trigger: 'blur'}
					]
				},
				//新增场地
				rulesSite:{
					name:[
						{required: true,validator:vifAddSiteName,trigger: 'blur'}
					],
					address:[
						{required: true,validator:vifAddSiteAddress,trigger: 'blur'}
					],
					memo:[
						{validator:vifSiteMemo,trigger: 'blur'}
					],
            		capacity:[
            			{validator:vifAddSiteCapacity,trigger: 'blur'}
            		],
            		sort:[
            			{validator:vifSiteNum,trigger: 'blur'}
            		]

				},
				//修改场地
				rulesSited:{
					name:[
						{required: true,validator:vifEditSiteName,trigger: 'blur'}
					],
					address:[
						{required: true,validator:vifEditSiteAddress,trigger: 'blur'}
					],
					memo:[
						{validator:vifSiteMemo,trigger: 'blur'}
					],
            		capacity:[
            			{validator:vifAddSiteCapacity,trigger: 'blur'}
            		],
            		sort:[
            			{validator:vifSiteNum,trigger: 'blur'}
            		]
				},
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				 addSitesForm:{
            		name:'',
            		address:'',
            		memo:'',
            		capacity:'',
            		sort:''
	            },
	            editSitesForm:{
	            	name:'',
	            	sort:'',
            		address:'',
            		memo:'',
            		capacity:'',
            		oldName:'',
            		oldAddress:'',
            		oldMemo:'',
            		oldCapacity:''
	            },
			codeList: {
                'category_base_place':false,//获取权限
                'btn_base_place_type_add':false,//新增场地类型
				'btn_base_place_type_update':false,//修改场地类型
				'btn_base_place_type_delete':false,//删除场地类型
				'page_base_place_place':false,//维护场地
				'btn_base_place_place_add':false,//新增场地
				'btn_base_place_place_update':false,//修改场地
				'btn_base_place_place_delete':false,//删除场地
				'btn_place_import':false//场地导入
           		 }
			}
		},
		created() {
			this.$parent.$emit('currentPage', '/base/site');
			getRcCodeList('category_base_place', this.codeList).then(() => {
				if(this.$route.params){
				if(this.$route.params.showTable){
					this.showTable = true;
					}else{
						this.showTable = false;
					}

				}else{
					this.showTable = false;
				}
				  if (window.sessionStorage.getItem('importSite')) {
			        this.sess = JSON.parse(window.sessionStorage.getItem('importSite'));
			        this.siteId=this.sess.siteIds;
			        this.unitId=this.sess.unitId;
			        this.getSiteList();
			     }
	          		this.getUnitTree();
        	});
		},
		watch: {
			filterText(val) {
			}
		},
		methods: {
			handleIconClick() {
				this.$refs.tree.filter(this.filterText);
			},
	        //获取单位树
			getUnitTree() {
		    	getUnitTree().then((res)=>{
		    		if(this.treeData && res.data.length > 0){
		    			  if (res.data.length == 1) {
		                        if (res.data[0].unitType == 2) {
		                        	 let userMsg = this.$getSess('user');
		                        	this.unitId=this.$getSess('user').data.unitId;
		                            this.isShowLeft = false;
		                        } else {
		                            this.isShowLeft = true;
		                        }
		                    } else {
		                        this.isShowLeft = true;
		                    }

						if(this.$route.params.unitId&&this.$route.params.unitId.length>0){
		            		this.selectTreeNodeId=this.$route.params.unitId;
		           		 }else{
		           		 	this.selectTreeNodeId = res.data[0].unitId;
		           		 }
		    			this.getSiteTypeList();
                    	this.treeData = this.$data2tree(res.data, 'unitId', 'parentId');
                	}
		    	})
			},
			handleNodeClick(data) {
				//此时的data就是我点击选择的单位树
				if(data.unitType==1){
					return false;
				}else{
					this.selectTreeNodeId = data.unitId;
					this.showTable = false;
				}

				 this.unitId=data.unitId;
				this.getSiteTypeList();

			},
			//获取场地类型
			getSiteTypeList(){
				this.siteData1 = [];
				if(this.unitId.length == 0){
					return false;
				}
				getSiteType('?unitId='+this.unitId).then((res)=>{
					this.siteData1=res.data;
				});
			},
			//搜索树
			filterNode(value, data) {
				if(!value) return true;
				return data.name.indexOf(value) !== -1;
			},
			merge(target) {
				for(let i = 1, j = arguments.length; i < j; i++) {
					let source = arguments[i] || {};
					for(let prop in source) {
						if(source.hasOwnProperty(prop)) {
							let value = source[prop];
							if(value !== undefined) {
								target[prop] = value;
							}
						}
					}
				}
			},
			//显示场地类型界面
			addSiteType() {
				this.$refs.addSiteForm.resetFields();
				this.dialogSiteFormVisible = true;
				 this.addSiteForm= {
					name: '',
					memo:'',
					sort:'',
					unitId:''
				}
			},
			//新增场地类型
			addSiteTypeList(){
				 this.$refs['addSiteForm'].validate((valid) => {
		          if (valid) {
		           		let para = Object.assign({}, this.addSiteForm);
		           		para.unitId=this.unitId;
						addSiteType(para).then((res) => {
							this.$notify({
								message: '提交成功',
								type: 'success'
							});
							this.$refs['addSiteForm'].resetFields();
							this.dialogSiteFormVisible = false;
							this.getSiteTypeList();
						});
		          } else {
		            console.log('error submit!!');
		            return false;
		          }
		        });
			},
			//显示修改场地类型
			handleSiteEdit(index, row) {
				this.$refs.editSiteForm.resetFields();
				this.editorSiteDialog = true;
				editSiteTypeNameVif(row.id).then((res)=>{
					this.siteTypeId=row.id;
					this.editSiteForm = Object.assign({}, res.data);
					this.editSiteForm.oldTypeName = this.editSiteForm.name;
					this.editSiteForm.oldSort = this.editSiteForm.sort;
					this.editSiteForm.oldMemo = this.editSiteForm.memo;
				})
			},
			//修改场地类型
			editSiteSubmit(){
				this.$refs.editSiteForm.validate((valid) => {
					if (valid) {
							let para = Object.assign({}, this.editSiteForm);
							editSiteType(para).then((res) => {
								this.$notify({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editSiteForm'].resetFields();
								this.editorSiteDialog = false;
								this.getSiteTypeList();
							});
					}
				});
			},
			//删除场地类型
			handleDelete(index, row) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let para =row.id;
					deleteSiteType(para).then((res)=>{
						this.$notify({
							message: '删除成功',
							type: 'success'
						});
						this.getSiteTypeList();
					})

				}).catch(() => {
				});
			},
			//获取场地列表
			getSiteList(index,row){
				getSiteList({
					placeTypeId:this.siteId,
					start:this.currentPage,
					size:this.pageSize
				}).then((res) => {
					this.siteData2=res.data.list;
					this.total=res.data.total;
				})
			},
			//分页事件
			handleCurrentChange(val) {
				this.currentPage=val;
				this.getSiteList();
			},
			//打开维修场地
			saveSite(data, val) {
				this.showTable = true;
				this.siteId=val.id;//场地类型id
				this.getSiteList();
			},
			//返回场地类型
			backSiteType(data, val){
				this.showTable = false;
			},
			//新增场地
			 addSiteVal(){
			 	this.$refs.addSitesForm.resetFields();
	        	this.dialogSitedFormVisible=true;
	        	this.addSitesForm={
            		name:'',
            		address:'',
            		memo:'',
            		capacity:'',
            		sort:''
	            }
	        },
	      	//提交新增场地
	      	submitAddSite(){
	      		this.$refs['addSitesForm'].validate((valid) => {
		          if (valid) {
		           		let para = Object.assign({}, this.addSitesForm);
		           		para.unitId=this.unitId;
		           		para.placeTypeId=this.siteId;
						addSite(para).then((res) => {
							this.$notify({
								message: '提交成功',
								type: 'success'
							});
							this.$refs['addSitesForm'].resetFields();
							this.dialogSitedFormVisible= false;
							this.getSiteList();
						});
		          } else {
		            console.log('error submit!!');
		            return false;
		          }
		        });
	      	},
	      	//打开修改场地界面
	      	handleSitesEdit(index,row){
	      		this.$refs.editSitesForm.resetFields();
	      		this.editorSitesDialog =true;
	      		this.rowId=row.id;
	      		editSiteVif(row.id).then((res)=>{
					this.editSitesForm = Object.assign({}, res.data);
					this.editSitesForm.oldName = this.editSitesForm.name;
					this.editSitesForm.oldSort = this.editSitesForm.sort;
					this.editSitesForm.oldMemo = this.editSitesForm.memo;
				})
	      	},
	      	//修改场地
	      	submitSiteList(){
	      		this.$refs.editSitesForm.validate((valid) => {
					if (valid) {
						let para = Object.assign({}, this.editSitesForm);
						editSite(para).then((res) => {
							this.$notify({
								message: '提交成功',
								type: 'success'
							});
							this.$refs['editSitesForm'].resetFields();
							this.editorSitesDialog = false;
							this.getSiteList();
						});
					}
				});
	      	},
			//删除场地
			handleSiteDelete(index, row) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let para =row.id;
					deleteSiteList(para).then((res)=>{
						this.$notify({
							message: '删除成功',
							type: 'success'
						});
						this.getSiteList();
					})

				}).catch(() => {});
			},
			//全选
			handleSelectionChange(sels) {
		        this.sels = sels;
		    },
		    //批量删除场地列表
	    	DeleteTableSite (val){
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					let para = { ids: ids };
					batchRemoveSiteList(para).then((res) => {
						this.$notify({
							message: '删除成功',
							type: 'success'
						});
						this.getSiteList();
					});
				}).catch(() => {
				});
	       	},
			//进入导入
			importSite(){
				this.sess={
					siteIds:this.siteId,
					unitId:this.unitId
				}
	        	this.$router.push({path: '/base/importSite/'+this.unitId});
	        	this.$setSess('importSite', this.sess);
	        }
		}
	}
</script>

<style scoped>
.sy-pk-step-site-box{
  position: relative;
  height: 700px;
  border: 1px solid #ccc;
  margin: 0 30px;
}
	.bodyDownHeight{
     position: absolute;
	    bottom: 5px;
	    width: 100%;
	    top:40px;
	}
	.full-parent{
		border:none;
	}
	.sy-top {
		position: absolute;
		top: 0;
		height: 45px;
		width: 100%;
		line-height: 45px;
		box-sizing: border-box;
		padding: 0 15px;
	}

	.sy-body {
		position: absolute;
		top: 45px;
		width: 100%;
		bottom: 45px;
		box-sizing: border-box;
		padding: 15px;
	}

	.sy-bottom {
		position: absolute;
		height: 45px;
		width: 100%;
		bottom: 0;
		line-height: 45px;
		box-sizing: border-box;
		padding: 0 15px;
	}

	.sy-row {
		width: 100%;
		overflow: hidden;
		box-sizing: border-box;
	}

	.sy-col {
		float: left;
		vertical-align: top;
		box-sizing: border-box;
	}


	.border {
		border: 1px solid #ccc;
	}
  /*重置内容区的位置*/
  .app-container-box {
    top:185px;
    bottom:50px;
  }
</style>
