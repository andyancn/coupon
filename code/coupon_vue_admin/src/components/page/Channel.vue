<template>
  <div>
    <div class="crumbs">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item><i class="el-icon-lx-share"></i> 渠道管理</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="container">
      <div class="handle-box">
        <el-select v-model="param.enable" placeholder="筛选启用状态" class="handle-select mr10">
          <el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in enableArr"></el-option>
        </el-select>
        <el-input v-model="param.channelCode" placeholder="输入渠道编号" class="handle-input mr10"></el-input>
        <el-button type="primary" icon="search" @click="search">搜索</el-button>
         <el-button type="primary" @click="add">新增</el-button>
      </div>
      <el-table :data="tableData" stripe border>
        <el-table-column v-for="item in columns" :key="item.id" :prop="item.field" :label="item.Text" :align="item.align?item.align:'center'"></el-table-column>
        <el-table-column prop="enable" label="启用状态" align="center" :formatter="formatEnable">
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" @click="changeStatus(scope.$index,scope.row.enable)">{{scope.row.enable == 1 ? '停用':'开启'}}</el-button>
            <el-button type="text" icon="el-icon-edit" @click="edit(scope.$index, scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
          <el-pagination background @current-change="currentChange" layout="total, prev, pager, next" :page-size="param.pageSize" :total="total">
          </el-pagination>
      </div>
    </div>
    <!-- 编辑弹出框 -->
    <el-dialog :title="titleForm === 'add' ? '添加新渠道' : '修改渠道'" :visible.sync="editVisible" width="500px" :closeOnPressEscape="false" :closeOnClickModal="false" @close="cancelForm">
      <el-form ref="form" :model="form" :rules="formRules" label-width="90px">
        <el-form-item label="渠道id" v-if="titleForm === 'edit'">
          <el-input v-model="form.id" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="渠道编号" prop="channelCode" v-if="titleForm === 'edit'">
          <el-input v-model="form.channelCode" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="渠道编号" prop="channelCode" v-if="titleForm === 'add'">
          <el-input v-model="form.channelCode"></el-input>
        </el-form-item>
          <el-form-item label="渠道名称" prop="channelName">
              <el-input v-model="form.channelName"></el-input>
          </el-form-item>
          <el-form-item label="启用状态" prop="enable">
            <el-select v-model="form.enable" placeholder="请选择">
              <el-option :key="index" :label="item.label" :value="item.value" v-for="(item, index) in enableArr"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
              <el-input v-model="form.remark"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
          <el-button @click="cancelForm">取 消</el-button>
          <el-button type="primary" @click="saveForm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除提示框 -->
    <el-dialog title="提示" :visible.sync="enableVisible" width="300px" center :closeOnPressEscape="false" :closeOnClickModal="false">
      <div class="del-dialog-cnt">是否要{{enableObj.label}}该渠道？</div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="enableVisible = false">取 消</el-button>
          <el-button type="primary" @click="enableComfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

export default {
  data() {
    return {
      enableArr:this.dataJs.enableArr,
      columns:[
        {field:'channelCode',Text:'渠道编号',},
        {field:'channelName',Text:'渠道名称'},
        {field:'createTime',Text:'创建时间'},
        {field:'updateTime',Text:'更新时间'},
        {field:'remark',Text:'备注'}
      ],
      tableData:null,
      total:0,
      editVisible:false,
      enableVisible:false,
      enableObj:{
        label:'',
        value:''
      },
      titleForm:'add',
      param:{
        pageIndex:1,
        pageSize:20,
        channelCode:'',
        enable:1
      },
      form:{
        channelCode:'',
        channelName:'',
        remark:'',
        enable:1
      },
      formRules:{
        channelCode:[{required: true, message: '渠道编号不能为空',trigger: 'blur,change' }],
        channelName:[{required: true, message: '渠道名称不能为空',trigger: 'blur,change' }],
        enable:[{required: true, message: '请选择启用状态',trigger: 'blur,change' }]
      }
    }
  },
  mounted(){
    this.getData();
  },
  methods: {
    // 分页导航
    currentChange(val) {
      this.param.pageIndex = val;
      this.getData();
    },
    /**
     * 开启状态格式化
     */
    formatEnable(row, column) {
      return row.enable == 1 ? '开启' : (row.enable == 0 ? '停用' : '未知')
    },
    //是否启用或者停用该渠道
    changeStatus(index,enable){
      this.enableObj = {
        index:index,
        label:enable == 1 ? '停用':'启用',
        value:enable == 1 ? 0 : 1
      } 
      this.enableVisible = true;
    },
    /**
     * 确认启用或停用该渠道
     */
    enableComfirm(){
      let item = this.tableData[this.enableObj.index],
          param = {
            id:item.id,
            channelCode:item.channelCode,
            channelName:item.channelName,
            enable:this.enableObj.value,
            remark:item.remark
          }
      this.editAjax(param,1);
    },
    /**
     * 搜索
     */
    search() {
      this.param.pageIndex = 1;
      console.log(this.param);
      this.getData();
    },
    /**
     * 获取列表数据
     */
    getData(){
      this.$ajax.getChannelList(this.param, res => {
        this.tableData = res.data.results;
        this.total = res.data.total;
      })
    },
    /**
     * 新增渠道
     */
    add(){
      this.titleForm = 'add';
      this.form = {
        channelCode:'',
        channelName:'',
        remark:'',
        enable:1
      }
      this.editVisible = true;
    },
    /**
     * 编辑
     */
    edit(index, row) {
      this.titleForm = 'edit';
      this.idx = index;
      const item = this.tableData[index];
      this.form = {
        id:item.id,
        channelCode:item.channelCode,
        channelName:item.channelName,
        remark:item.remark,
        enable:item.enable
      }
      this.editVisible = true;
    },
    /**
     * 关闭弹窗重置弹窗内容
     */
    cancelForm(){
      this.$refs.form.resetFields();
      this.editVisible = false;
    },
    /**
     * 保存
     */
    saveForm(){
      console.log( this.form);
      this.$refs.form.validate(valid =>{
        if(valid){
           if(this.titleForm == 'add'){
            this.addAjax(this.form);
          } else {
            this.editAjax(this.form,2);
          }
        }else{
          return;
        }
      })
    },
    /**
     * 调用编辑渠道接口
     */
    editAjax(param,type){
      console.log(param);
      this.$ajax.editChannel(param, res => {
        this.$message({
          type: "success",
          message: "修改成功"
        });
        this.getData();
        if(type === 1){
          this.enableVisible = false
        }else{
          this.cancelForm();
        }
      })
    },
    /**
     * 调用新增渠道接口
     */
    addAjax(param){
      this.$ajax.addChannel(param, res => {
        this.$message({
          type: "success",
          message: "新增成功"
        });
        this.getData();
        this.cancelForm();
      })
    }
  }
}
</script>


<style scoped>
  .handle-box {
    margin-bottom: 20px;
  }
  .handle-input {
    width: 220px;
    display: inline-block;
  }
</style>
