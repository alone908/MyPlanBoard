/*
Created by PhpStorm.
User: Chung Jun
Date: 4/20/2018
Time: 20:00 PM

app
 |---[navbar]
 |      |
 |      |---[nav-items]
 |
 |---[app-content]
        |
        |---[left-content]
        |      |
        |      |---[story-list-container]
        |      |      |
        |      |      |---[storylist-title]
        |      |      |---[add-story-form]
        |      |      |---[story-list]
        |      |
        |      |---[story-list-container]
        |      |      |
        |      |      |---[storylist-title]
        |      |      |---[add-story-form]
        |      |      |---[story-list]
        |      |
        |      |---[story-post-container]
        |             |
        |             |---[story-post-column]
        |             |---[story-post-column]
        |             |---[story-post-column]
        |             |---[story-post-column]
        |
        |---[right-content]
               |
               |---[story-detail]
*/

Vue.component('story-post-container',{
    data: function(){
        return {
            styleObj: {position: 'relative', top: '0px', left: '0px', padding: '10px', height: '100%'}
        }
    },
    props:['stories','display'],
    template:'<div v-if="display.storyPostContainer" v-bind:style="styleObj">\n' +
    '                <story-post-column v-bind:stories="stories" title="TO DO" status="toDo"></story-post-column>\n' +
    '                <story-post-column v-bind:stories="stories" title="IN PROGRESS" status="inProgress"></story-post-column>\n' +
    '                <story-post-column v-bind:stories="stories" title="IN QA" status="qa"></story-post-column>\n' +
    '                <story-post-column v-bind:stories="stories" title="DONE" status="done"></story-post-column>\n' +
    '            </div>'
})

Vue.component('story-post-column',{
    data: function(){
        return {
            columnStyle: {
                display: 'inline-block',
                width: '24%',
                padding: '5px',
                borderRadius: '5px',
                border: '1px solid #D1D3D6',
                height: '100%'
            },
            titleStyle: {backgroundColor: '#F2F4F6', border: '0px'},
            postStyle: {marginTop: '10px', cursor: 'move'},
            tableStyle: {border: '1px solid #D1D3D6', width: '100%'},
            thStyle: {backgroundColor: '#DEDFE2', padding: '5px'},
            tdStyle: {whiteSspace: 'normal', padding: '5px'},
            imageStyle: {verticalAalign: 'text-bottom'}
        }
    },
    props:['stories','title','status','detailStoryKey','droptype'],
    methods:{
        clickPost:function(key,detailStoryKey){
            this.$root.$data.detailStoryKey = key;
        },
        drag:function(e){
            e.dataTransfer.setData("text", e.target.dataset.key);
            e.target.style.backgroundColor = "black";
            e.target.style.color = "white";
            e.target.getElementsByTagName('th')[0].style.backgroundColor = "black";
        },
        dragend:function(e){
            e.target.style.backgroundColor = "white";
            e.target.style.color = "black";
            e.target.getElementsByTagName('th')[0].style.backgroundColor = "#D1D3D6";
        },
        dragover:function(e){
            e.preventDefault();
        },
        drop:function(e,stories){
            e.preventDefault();
            var key = e.dataTransfer.getData("text");
            for(var i=0; i<e.path.length; i++){
                var status = e.path[i].dataset.status;
                if(typeof status !== 'undefined') break;
            }
            if(status === 'toDo'){ stories[key].status = 'toDo';}
            else if(status === 'inProgress'){ stories[key].status = 'inProgress'; }
            else if(status === 'qa'){ stories[key].status = 'qa'; }
            else if(status === 'done'){ stories[key].status = 'done'; }
        }
    },
    template:'<div v-on:drop="drop($event,stories)" v-on:dragover="dragover" :data-status="status" v-bind:style="columnStyle">\n' +
    '                    <div class="alert alert-secondary" v-bind:style="titleStyle">{{title}}</div>\n' +
    '                    <div v-for="story in stories" v-if="story.status === status" v-on:click="clickPost(story.key,detailStoryKey)" v-on:dragstart="drag" v-on:dragend="dragend" :data-key="story.key" draggable="true" v-bind:style="postStyle">\n' +
    '                        <table v-bind:style="tableStyle">\n' +
    '                            <tr><th v-bind:style="thStyle"><img src="images/storyicon.svg" v-bind:style="imageStyle">{{story.id}}</th></tr>\n' +
    '                            <tr><td v-bind:style="tdStyle">{{story.description}}</td></tr>\n' +
    '                        </table>\n' +
    '                    </div>\n' +
    '                </div>'
})

Vue.component('nav-items',{
    data: function () {
        return {
            navItems:[
                {id:'navItem-1',item:'Backlog',active:true},
                {id:'navItem-2',item:'ActiveSprint',active:false}
            ],
            itemStyle:{cursor:'pointer'}
        }
    },
    props:['display'],
    methods: {
        clickNavItem:function (e,display) {
            if(e.target.classList.value.indexOf('active') === -1){
                if(e.target.textContent === 'ActiveSprint'){
                    display.storyListContainer = false;
                    display.storyPostContainer = true;
                }
                if(e.target.textContent === 'Backlog'){
                    display.storyListContainer = true;
                    display.storyPostContainer = false;
                }
            }
            this.$data.navItems.forEach(function (i, k) { i.active = (e.target.id === i.id) ? true : false ; });
        }
    },
    template: '<div class="navbar-nav" v-if="display.navItems">' +
    '<a v-for="item in navItems" :id="item.id" class="nav-item nav-link" v-bind:class="{active: item.active}" v-bind:style="itemStyle" v-on:click="clickNavItem($event,display)">{{item.item}}</a>' +
    '       </div>'
});

Vue.component('navbar', {
    data: function () {
        return {
            brand:'Vue-PlanBoard',
        }
    },
    props:['display'],
    template: '' +
    '<nav class="navbar navbar-expand-lg navbar-dark bg-dark" v-if="display.navbar">\n' +
    '    <a class="navbar-brand" href="#">{{brand}}</a>\n' +
    '    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">\n' +
    '        <nav-items v-bind:display="display"></nav-items>\n' +
    '    </div>\n' +
    '</nav>'
})

Vue.component('storylist-title',{
    data: function(){ return {
        titleStyle: {margin: '10px 20px', display: 'inline-block', fontWeight:'bold'}
    } },
    props:['title'],
    template:'<div v-bind:style="titleStyle"><span>{{title}}</span></div>'
})

Vue.component('story-list',{
    data: function () {
        return {
            listStyle: {margin: '10px 20px', paddingBbottom: '20px'},
            itemStyle: {
                height: '32px',
                border: '1px solid #DBDDE2',
                marginTop: '-1px',
                fontSize: '14px',
                cursor: 'move',
                position: 'relative'
            },
            contStyle: {
                paddingLleft: '5px',
                boxSizing: 'border-box',
                overflow: 'hidden',
                position: 'relative',
                whiteSpace: 'nowrap'
            },
            storyStyle: {height: '22px', margin: '5px 0px', lineHeight: '22px'},
            iconStyle: {display: 'inline-block', marginLeft: '16px'},
            imageStyle: {verticalAalign: 'text-bottom'},
            descripStyle: {display: 'inline-block', marginLeft: '16px'},
            idStyle: {position: 'absolute', right: '0px', top: '5px', height: '22px', padding: '0px 5px 0px 20px'},
            sidebarStyle: {
                backgroundColor: '#cc0000',
                width: '2px',
                left: '2px',
                top: '2px',
                bottom: '2px',
                height: 'auto',
                position: 'absolute',
                textIndent: '-9999em'
            }
        }
    },
    props:['stories','status','detailStoryKey','droptype'],
    template:'<div v-bind:style="listStyle" v-on:drop="drop($event,stories)" v-on:dragover="dragover" :data-droptype="droptype">' +
    '                    <div :id="story.id" v-for="story in stories" v-if="status.indexOf(story.status) !== -1" v-on:click="clicklist(story.key,detailStoryKey)" v-on:dragstart="drag" v-on:dragend="dragend" :data-key="story.key" draggable="true" v-bind:style="itemStyle">\n' +
    '                        <div v-bind:style="contStyle">\n' +
    '                            <div v-bind:style="storyStyle">\n' +
    '                                <span v-bind:style="iconStyle"><img src="images/storyicon.svg" v-bind:style="imageStyle"></span>\n' +
    '                                <span v-bind:style="descripStyle">{{story.description}}</span>\n' +
    '                            </div>\n' +
    '                        </div>\n' +
    '                        <div v-bind:style="idStyle">\n' +
    '                            <span>{{story.id}}</span>\n' +
    '                        </div>\n' +
    '                        <div v-bind:style="sidebarStyle"></div>\n' +
    '                    </div>' +
    '</div>',
    methods:{
        clicklist:function(key,detailStoryKey){
            this.$root.$data.detailStoryKey = key;
        },
        drag:function(e){
            e.dataTransfer.setData("text", e.target.dataset.key);
            e.target.style.backgroundColor = "black";
            e.target.style.color = "white";
        },
        dragend:function(e){
            e.target.style.backgroundColor = "white";
            e.target.style.color = "black";
        },
        dragover:function(e){
            e.preventDefault();
        },
        drop:function(e,stories){
            e.preventDefault();
            var key = e.dataTransfer.getData("text");
            for(var i=0; i<e.path.length; i++){
                var droptype = e.path[i].dataset.droptype;
                if(typeof droptype !== 'undefined') break;
            }
            if(droptype === 'sprint'){ stories[key].status = 'toDo';}
            else if(droptype === 'backlog'){ stories[key].status = 'backlog'; }
        }
    }
})

Vue.component('story-detail',{
    data: function (){
        return {
            detailStyle: {paddingTop: '10px'},
            idStyle: {fontWeight: 'bold'},
            imageStyle: {verticalAlign: 'text-bottom'},
            descriptStyle: {
                position: 'relative',
                marginTop: '10px',
                fontSize: '18px',
                fontWeight: 'bold',
                whiteSpace: 'normal',
                padding: '5px'
            },
            textStyle: {
                width: '100%',
                height: '100%',
                position: 'absolute',
                top: '0px',
                left: '0px',
                whiteSpace: 'normal',
                padding: '5px',
                borderColor: '#cc0000',
                borderRadius: '5px',
                overflow: 'hidden',
                fontWeight:'500'
            },
            propStyle: {marginTop: '10px', fontSize: '14px', fontWeight: 'bold', whiteSpace: 'normal'}
        }
    },
    props:['stories','detailStoryKey'],
    template:'<div v-bind:style="detailStyle">\n' +
    '                <span v-bind:style="idStyle"><img src="images/storyicon.svg" v-bind:style="imageStyle">{{stories[detailStoryKey].id}}</span>\n' +
    '                <div v-bind:style="descriptStyle">{{stories[detailStoryKey].description}}' +
    '                   <textarea v-model="stories[detailStoryKey].description" v-bind:style="textStyle"></textarea>' +
    '                </div>\n' +
    '                <div v-bind:style="propStyle">Project:&nbsp;{{stories[detailStoryKey].project}}</div>\n' +
    '                <div v-bind:style="propStyle">Status:&nbsp;{{stories[detailStoryKey].status}}</div>\n' +
    '\n' +
    '            </div>'
})

Vue.component('add-story-form',{
    data:function(){
        return {
            errmsg:'',
            proj:null,
            descrip:null,
            addStyle: {width: '70%', display: 'inline-block'},
            formStyle: {display: 'inline-flex', width: '100%'},
            projStyle: {padding: '3px 6px', width: '15%'},
            descriptStyle: {padding: '3px 6px', width: '60%'},
            btnStyle: {padding: '3px 6px'},
            msgStyle: {display: 'inline-block', marginLeft: '10px', color: '#cc0000'}
        }
    },
    props:['stories','projects','projlast','status'],
    template:'<div v-bind:style="addStyle">\n' +
    '                    <form class="form-inline" v-bind:style="formStyle">\n' +
    '                        <input type="text" class="form-control mr-sm-2" name="proj" id="proj" v-model="proj" v-bind:style="projStyle" placeholder="Project">\n' +
    '                        <input type="text" class="form-control mr-sm-2" name="descrip" id="descrip" v-model="descrip" v-bind:style="descriptStyle" placeholder="Description">\n' +
    '                        <button type="button" class="btn btn-dark" v-on:click="addstory(stories,projects,projlast,status)" v-bind:style="btnStyle">Add Story</button>\n' +
    '                        <span v-bind:style="msgStyle">{{errmsg}}</span>\n' +
    '                    </form>\n' +
    '                </div>',
    methods:{
        addstory:function(stories,projects,projlast,status){
            errmsg = '';
            if(!this.proj || !this.descrip){
                this.$data.errmsg = 'all fields required.'
            }else {
                if(projects.indexOf(this.proj) === -1){
                    projects.push(this.proj);
                    projlast[this.proj] = 1;
                    stories.push({id:this.proj+'-1',key:stories.length,status:status,project:this.proj,description:this.descrip});
                }else if(projects.indexOf(this.proj) !== -1){
                    projlast[this.proj] ++;
                    stories.push({id:this.proj+'-'+projlast[this.proj].toString(),key:stories.length,status:status,project:this.proj,description:this.descrip});
                }
            }
        }
    }
})

Vue.component('story-list-container',{
    data:function(){
        return {
            listStyle: {position: 'relative', top: '0px', left: '0px'}
        }
    },
    props:['stories','title','status','projects','projlast','statusArray','detailStoryKey','droptype','display'],
    template:'<div v-if="display.storyListContainer" v-bind:style="listStyle">\n' +
    '                <storylist-title v-bind:title="title"></storylist-title>\n' +
    '                <add-story-form v-bind:stories="stories" v-bind:status="status" v-bind:projects="projects" v-bind:projlast="projlast"></add-story-form>\n' +
    '                <story-list v-bind:stories="stories" v-bind:status="statusArray" v-bind:detail-story-key="detailStoryKey" v-bind:droptype="droptype"></story-list>\n' +
    '            </div>'
})

var app = new Vue({
    el: '#app',
    data:{
        display:{
            navbar:true,
            navItems:true,
            storyListContainer:true,
            storyPostContainer:false
        },
        leftContH:(window.innerHeight-56).toString()+'px',
        stories:[
            {id:'PHIS-100',key:0,status:'toDo',project:'PHIS',description:'Construct schedule part for the wizard'},
            {id:'IQM-262',key:1,status:'toDo',project:'IQM',description:'Construct cronjob for sending emails'},
            {id:'IEN-132',key:2,status:'toDo',project:'IEN',description:'Update policy acceptance with correct document.'},
            {id:'PHIS-135',key:3,status:'toDo',project:'PHIS',description:'add a page where admins can create new USB campaign. It will be a single page with campaign name, location, the education page that will be displayed when macro is run (similar to randomizer only select from list).'},
            {id:'IEN-634',key:4,status:'toDo',project:'IEN',description:'QA Randomizer Wizard'},
            {id:'IEN-545',key:5,status:'inProgress',project:'IEN',description:'make the completed campaign report work with randomizer data structure.'},
            {id:'IQM-865',key:6,status:'inProgress',project:'IQM',description:'As an admin, I must have the ability to schedule multiple campaigns (with unique templates) within the same batch timeframe. '},
            {id:'IEN-264',key:7,status:'inProgress',project:'IEN',description:'Need a feature to "publish to lms".'},
            {id:'IEN-457',key:8,status:'qa',project:'IEN',description:'simulation page can\'t not be editable'},
            {id:'PHIS-526',key:9,status:'qa',project:'PHIS',description:'Global reporting/By individual for randomized campaigns'},
            {id:'IQM-456',key:10,status:'done',project:'IQM',description:'when adding/removing preexam and final remember exact page position and put back where it was originally. If a module is left empty after removing page, remove the module and insert it back as well'},
            {id:'IQM-756',key:11,status:'backlog',project:'IQM',description:'PhishProof - Ameritas - Total Count vs Current Count'},
            {id:'IQM-234',key:12,status:'backlog',project:'IQM',description:'If set target to a campaign that had it\'s target set to another campaign, email server will not be able to compose the targets.'},
            {id:'PHIS-344',key:13,status:'backlog',project:'PHIS',description:'add superadmin UI to add page blocks (one page block is a single zip file with thumbnail, xml file and all needed images and media'},
            {id:'IQM-364',key:14,status:'backlog',project:'IQM',description:'convert all unique page types to be made with sequencer'},
            {id:'IEN-875',key:15,status:'backlog',project:'IEN',description:'phishhook activation email sent from test doesnt have userid'},
            {id:'PHIS-745',key:16,status:'backlog',project:'PHIS',description:'For quiz dialogs. The course editor can not distinguish the error messages in quizzes'},
            {id:'PHIS-867',key:17,status:'backlog',project:'PHIS',description:'support adding (uploading) inline images and external link images to education emails sent.\n'},
            {id:'PHIS-987',key:18,status:'backlog',project:'PHIS',description:'As an Admin, I need to easily be able to select groups and/or hierarchy in the trend analysis report.'},
            {id:'IQM-253',key:19,status:'backlog',project:'IQM',description:'Add course progress bar to the control panel for mobile skin.'},
            {id:'IQM-374',key:20,status:'backlog',project:'IQM',description:'feature requested, change collection end date for completed campaign'},
            {id:'IEN-475',key:21,status:'backlog',project:'IEN',description:'Image edite thumbnail issue'},
            {id:'PHIS-856',key:22,status:'backlog',project:'PHIS',description:'In manage packages, Copyright block position will change after save template'},
            {id:'PHIS-687',key:23,status:'backlog',project:'PHIS',description:'In IE11 edit button background color setting is wrong'},
            {id:'IQM-486',key:24,status:'backlog',project:'IQM',description:'Go over all mysql queries and escape all non-number values'}
        ],
        detailStoryKey:0,
        projects:[
            'PHIS',
            'IEN',
            'IQM'
        ],
        projlast:{
            'PHIS':1325,
            'IEN':1012,
            'IQM':1186
        },
        contentStyle: {width: '100%'},
        leftContentStyle: {
            display: 'inline-block',
            width: '80%',
            float: 'left',
            overflow: 'auto',
            height: (window.innerHeight - 56).toString() + 'px'
        },
        rightContentStyle: {display: 'inline-block', width: '20%', float: 'right', padding: '0px 5px'}
    },
    methods:{

    }

})
