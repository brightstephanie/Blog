Ractive.DEBUG = false;
function index(page){
    var page = parseInt(page) || 1;
    window._G = window._G || {post: {}, postList: {}};
    $('title').html(_config['blog_name']);
    if(_G.postList[page] != undefined){
      $('#container').html(_G.postList[page]);
      return;
    }

    $.ajax({
        url:"https://api.github.com/repos/"+_config['owner']+"/"+_config['repo']+"/issues",
        data:{
            filter       : 'created',
            page         : page,
            access_token : _config['access_token'],
            per_page     : _config['per_page']
        },
        beforeSend:function(){
          $('#container').html('<center><img src="loading.gif" class="loading"></center>');
        },
        success:function(data, textStatus, jqXHR){
            var link = jqXHR.getResponseHeader("Link") || "";
            var next = false;
            var prev = false;
            if(link.indexOf('rel="next"') > 0){
              next = true;
            }
            if(link.indexOf('rel="prev"') > 0){
              prev = true;
            }
            var ractive = new Ractive({
                template : '#listTpl',
                data     : {
                    posts : data,
                    next  : next,
                    prev  : prev,
                    page  : page
                }
            });
            window._G.postList[page] = ractive.toHTML();
            $('#container').html(window._G.postList[page]);

            //将文章列表的信息存到全局变量中，避免重复请求
            for(i in data){
              var ractive = new Ractive({
                  template : '#detailTpl',
                  data     : {post: data[i]}
              });
              window._G.post[data[i].number] = {};
              window._G.post[data[i].number].body = ractive.toHTML();
              
              var title = data[i].title + " | " + _config['blog_name'];
              window._G.post[data[i].number].title = title;
            }
        }
    });
}

function highlight(){
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
}

// 动态加载多说评论框的函数
function toggleDuoshuoComments(container, id){
    var el = document.createElement('div');
    var url = window.location.href;
    el.setAttribute('data-thread-key', id);
    el.setAttribute('data-url', url);
    DUOSHUO.EmbedThread(el);
    jQuery(container).append(el);
}

function detail(id){
    if(!window._G){
      window._G = {post: {}, postList: {}};
      window._G.post[id] = {};  
    }
    
    if(_G.post[id].body != undefined){
      $('#container').html(_G.post[id].body);
      $('title').html(_G.post[id].title);
      toggleDuoshuoComments('#container', id);
      highlight();
      return;
    }
    $.ajax({
        url:"https://api.github.com/repos/"+_config['owner']+"/"+_config['repo']+"/issues/" + id,
        data:{
            access_token:_config['access_token']
        },
        beforeSend:function(){
          $('#container').html('<center><img src="loading.gif" alt="loading" class="loading"></center>');
        },
        success:function(data){
            var ractive = new Ractive({
                 el: "#container",
                 template: '#detailTpl',
                 data: {post: data}
            });

            $('title').html(data.title + " | " + _config['blog_name']);
            toggleDuoshuoComments('#container', id);
            highlight();
        }
    });  

}

var helpers = Ractive.defaults.data;
helpers.markdown2HTML = function(content){
    return marked(content);
}
helpers.formatTime = function(time){
    return time.substr(0,10);
}

var routes = {
    '/': index,
    'p:page': index,
    'post/:postId': detail
};
var router = Router(routes);
router.init('/');


// index.jsx
var React = require('react');
var ReactDOM = require('react-dom');
var MyButtonController = require('./components/MyButtonController');

ReactDOM.render(
<MyButtonController/>,
    document.querySelector('#example')
);


var React = require('react');
var ReactDom = require('react-dom');
var MyButtonController = require('./components/MyButtonController');
ReactDom.render(
    <MyButtonController/>,
    document.querySelector('#example')
);

// components/MyButtonController.jsx
var React = require('react');
var ButtonActions = require('../actions/ButtonActions');
var MyButton = require('./MyButton');

var MyButtonController = React.createClass({
    createNewItem: function (event) {
        ButtonActions.addNewItem('new item');
    },

    render: function() {
        return <MyButton
        onClick={this.createNewItem}
        />;
    }
});

module.exports = MyButtonController;

var React = require('react');
var ButtonActions = require('../actions/ButtonActions');
var MyButton = require('./MyButton');

var MyButtonController = React.createClass({
    createNewItem: function (event) {
        ButtonActions.addNewItem('new item');
    },

    render: function () {
        return <MyButton
        onclick={this.createNewItem}
        />;
    }
});
module.exports = MyButtonController;


// components/MyButton.jsx
var React = require('react');

var MyButton = function(props) {
    return <div>
    <button onClick={props.onClick}>New Item</button>
    </div>;
};

module.exports = MyButton;

var React = require('react');
var MyButton = function (props) {
    return <div>
        <button onClick={props.onClick}>New Item</button>
        </div>;
};

module.exports = MyButton;


// actions/ButtonActions.js
var AppDispatcher = require('../dispatcher/AppDispatcher');

var ButtonActions = {
    addNewItem: function (text) {
        AppDispatcher.dispatch({
            actionType: 'ADD_NEW_ITEM',
            text: text
        });
    },
};

var AppDispatcher = require('../dispatcher/AppDispatcher');
var AooDispatcher = {
    addNewItem: function (text) {
        AppDispatcher.dispatch({
            actionType: 'ADD_NEW_ITEM',
            text: text
        })
    }
}


var Dispatcher = require('flux').Dispatcher;
module.exports = new Dispatcher();

var Dispatcher = require('flux').Dispatcher;
module.exports = new Dispatcher();

// dispatcher/AppDispatcher.js
var ListStore = require('../stores/ListStore');

AppDispatcher.register(function (action) {
    switch(action.actionType) {
        case 'ADD_NEW_ITEM':
            ListStore.addNewItemHandler(action.text);
            ListStore.emitChange();
            break;
        default:
        // no op
    }
})

var ListStore = require('../stores/ListStore');

AppDispatcher.register(function (action) {
    switch (action.actionType) {
        case 'ADD_NEW_ITEM':
            ListStore.addNewItemHandler(action.text);
            ListStore.emitChange();
            break;
        default;
    }
})

// stores/ListStore.js
var ListStore = {
    items: [],

    getAll: function() {
        return this.items;
    },

    addNewItemHandler: function (text) {
        this.items.push(text);
    },

    emitChange: function () {
        this.emit('change');
    }
};

module.exports = ListStore;

var ListStore = {
    items: [],

    getAll: function () {
        return this.items;
    },
    addNewItemHandler: function (text) {
        this.items.push(text);
    },
    emitChange: function () {
        this.emit('Change');
    }
};
module.exports = ListStore;


// stores/ListStore.js
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');

var ListStore = assign({}, EventEmitter.prototype, {
    items: [],

    getAll: function () {
        return this.items;
    },

    addNewItemHandler: function (text) {
        this.items.push(text);
    },

    emitChange: function () {
        this.emit('change');
    },

    addChangeListener: function(callback) {
        this.on('change', callback);
    },

    removeChangeListener: function(callback) {
        this.removeListener('change', callback);
    }
});

var EventEmitter = require('events').EventEmitter;
var assign = require('object-asign');
var ListStore = assign({}, EventEmitter.prototype, {
    items: [],
    getAll: function () {
        return this.items;
    },
    addNewItemHandler: function (text) {
        this.items.push(text);
    },
    emitChange: function () {
        this.emit('change');
    },
    addChangeListener: function (callback) {
        this.on('change', callback);
    }

    removeChangeListener: function (callback) {
        this.removeListener('change', callback);
    }
});


// components/MyButtonController.jsx
var React = require('react');
var ListStore = require('../stores/ListStore');
var ButtonActions = require('../actions/ButtonActions');
var MyButton = require('./MyButton');

var MyButtonController = React.createClass({
    getInitialState: function () {
        return {
            items: ListStore.getAll()
        };
    },
    componentDidMount: function() {
        ListStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function() {
        ListStore.removeChangeListener(this._onChange);
    },
    _onChange: function () {
        this.setState({
            items: ListStore.getAll()
        });
    },
    createNewItem: function (event) {
        ButtonActions.addNewItem('new item');
    },
    render: function() {
        return <MyButton
        items={this.state.items}
        onClick={this.createNewItem}
        />;
    }
});
var MyButtonController = React.createClass({
    getInitialState: function () {
        return {
            items: ListStore.getAll()
        };
    },
    componentDidMount: function () {
        ListStore.addChangeListener(this._onChange);
    },
    componentWillUnmount: function () {
        ListStore.removeChangeListener(this._onChange);
    },
    _onChange: function () {
        this.setState({
            items: ListStore.getAll()
        });
    },
    createNewItem: function (event) {
       ButtonActions.addNewItem('new item');
    },
    render: function () {
        return <MyButton
        items = {this.state.items}
        onClick={this.createNewItem}
        />;
    }
})


// components/MyButton.jsx
var React = require('react');

var MyButton = function(props) {
    var items = props.items;
    var itemHtml = items.map(function (listItem, i) {
        return <li key={i}>{listItem}</li>;
    });

    return <div>
    <ul>{itemHtml}</ul>
    <button onClick={props.onClick}>New Item</button>
    </div>;
};

module.exports = MyButton;

var React = require('react');

var MyButton = function (props) {
    var items = props.items;
    var itemHtml = items.map(function (listItem, i) {
        return <li key={i}>{listItem}</li>;
    });

    return <div>
        <ul>{itemHtml}</ul>
        <button onClick={props.onClick}>New Item</button>
        </div>;
};

import { createStore } from 'redux';
const store = createStore(fn);

import{createStore} from 'redux';
const store = createStore(fn);
const state = store.getState;

const action = {
    type: 'ADD_TODO',
    payload: 'Learn Redux'
};

const action = {
    type: 'ADD_TODo',
    payload:'Learn Redux'
};

const ADD_TODO = '添加 TODO';

function addTodo(text) {
    return {
        type: ADD_TODO,
        text
    }
}

const action = addTodo('Learn Redux');

const ADD_TODO = '添加 TODO';
function addTodo(text) {
    return {
        type: ADD_TODO,
        text
    }
}

import { createStore } from 'redux';
const store = createStore(fn);

store.dispatch({
    type: 'ADD_TODO',
    payload: 'Learn Redux'
});

import {createStore} from 'redux';
const store = createStore(fn);
store.dispatch({
    type: 'ADD_TODO',
    payload: 'Learn Redux'
});

store.dispatch(addTodo('Learn Redux'));

store.dispatch(addTodo('Learn Redux'));

const reducer = function (state, action) {
    // ...
    return new_state;
};

const reducer = function (state, action) {
    return new_state;
}


const defaultState = 0;
const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'ADD':
            return state + action.payload;
        default:
            return state;
    }
};

const state = reducer(1, {
    type: 'ADD',
    payload: 2
});

const defaultState = 0;
const reducer = (state = defaultState, action) => {
    switch (action.type) {
        case 'ADD';
            return state + action.payload;
        default:
            return state;
    }
};
const state = reducer(1, {
    type: 'ADD',
    payload: 2
})

<div id='mountNode>{{message}}</div>
var vm = new Vue({
    el: '#mountNode',
    data: function () {
        return{
            message: 'Hello World'
        };
    }
})

function Vue(options) {
    this._init(option)
}

Vue.prototype._init = function (options) {
    options = this.$options = mergeOptions(
        this.constructor.options,
        options,
        this
    )
    this._initState()
    if (options.el) {
        this.$mount(options.el)
    }
}
