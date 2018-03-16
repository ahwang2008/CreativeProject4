var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    text1: '',
    show: 'active',
    drag: {},
    sortCalled: true,
  },
  created: function() {
    this.getItems();
  },
  computed: {
    activeItems: function() {
      return this.items.filter(function(item) {
	    return !item.completed;
      });
    },
    filteredItems: function() {
      if (this.sortCalled) {
        return this.items.sort((a,b) => {if (a.text1 < b.text1)
          return -1
        if (a.text1 > b.text1)
          return 1
        return 0});
      }
      if (this.show === 'active')
	      return this.items.filter(function(item) {
	      return !item.completed;
      });
      /*
      if (this.show === 'completed')
	      return this.items.filter(function(item) {
	      return item.completed;
      });*/
      return this.items;
    },
    
  },

  methods: {
    addItem: function() {
      axios.post("http://localhost:3000/api/items", {
      text: this.text,
      text1: this.text1,
      priority: this.priority,
	    completed: false
      }).then(response => {
      this.text = "";
      this.text1= "";
	    this.getItems();
	    return true;
      }).catch(err => {
      });
    },
    completeItem: function(item) {
      axios.put("http://localhost:3000/api/items/" + item.id, {
      text: item.text,
      text1: item.text1,
	    completed: !item.completed,
	    orderChange: false,
      }).then(response => {
	    return true;
      }).catch(err => {
      });
    },
    upPriority: function(item) {
      axios.put("http://localhost:3000/api/items/" + item.id, {
      text: item.text,
      text1: item.text1,
      priority: item.priority,
      priorityUp: true,
      }).then(response => {
      this.getItems();
	    return true;
      }).catch(err => {
      });
    },
    downPriority: function(item) {
      axios.put("http://localhost:3000/api/items/" + item.id, {
      text: item.text,
      text1: item.text1,
      priority: item.priority,
      priorityDown: true,
      }).then(response => {
      this.getItems();
	    return true;
      }).catch(err => {
      });
    },
    deleteItem: function(item) {
      axios.delete("http://localhost:3000/api/items/" + item.id).then(response => {
	    this.getItems();
	    return true;
      }).catch(err => {
      });
    },
    getItems: function() {
      axios.get("http://localhost:3000/api/items").then(response => {
	    this.items = response.data;
	    return true;
      }).catch(err => {
      });
    },
    /*showAll: function() {
      this.show = 'all';
    },
    showActive: function() {
      this.show = 'active';
    },
    /*showCompleted: function() {
      this.show = 'completed';
    },
    sortItems: function() {
      this.sortCalled = true;
    },*/
    deleteCompleted: function() {
      this.items.forEach(item => {
	    if (item.completed)
	      this.deleteItem(item)
      });
    },
    dragItem: function(item) {
      this.drag = item;
    },
    dropItem: function(item) {
      axios.put("http://localhost:3000/api/items/" + this.drag.id, {
      text: this.drag.text,
      text1: this.drag.text1,
	    completed: this.drag.completed,
	    orderChange: true,
      orderTarget: item.id,
      priority: this.drag.priority,
      }).then(response => {
	    this.getItems();
	    return true;
      }).catch(err => {
      });
    },
  }
});
