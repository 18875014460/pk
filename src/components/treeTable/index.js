// /*
// * @Author: sunlandong
// * @Date:   2017-03-11 12:05:25
// * @Last Modified by:   sunlandong
// * @Last Modified time: 2017-03-11 12:05:52
// */

// import TreeGrid from './vue/TreeGrid.vue'

// module.exports = {
//   TreeGrid
// }
import treeTable from './vue/TreeGrid.vue';

/* istanbul ignore next */
treeTable.install = function(Vue) {
    Vue.component(treeTable.name, treeTable);
};

export default treeTable;