function ttp() {
    $('[data-toggle="tooltip"]').tooltip()
}
function hideTtp() {
    $('[data-toggle="tooltip"]').tooltip('hide')
}
function route(path = '/', component = {}) {
    return { path: path, component: component }
}

Vue.use(Vue2Storage, {
    prefix: 'app_',
    driver: 'local'
})

commitTypes.forEach((item) => item.label = item.emoji + ' ' + item.desc);

Vue.component('v-select', VueSelect.VueSelect);

app = new Vue({
    data: {

    },
    methods: {

    },
    router: new VueRouter({
        mode: 'history',
        hash: false,
        routes: [
            route('/', {
                template: `<div class="mt-5 text-center" style="padding-top:7%">
							<h1 class="mb-3" style="color:#06f"><i class="octicon octicon-git-commit"></i> Commit generator</h1>
							<h6 class="mt-3 mb-5" style="color:#999">Commit your way!</h6>
							<div class="form-row justify-content-center align-items-center">
								<div class="col-10 col-sm-12 my-1">
									<div class="input-group">
                                        <span class="input-group-btn">
                                            <v-select placeholder="Select a type" v-model="type" :options="commitTypes"></v-select>
                                        </span>
										<input v-model="commit" style="border-radius:.25rem" class="form-control blr-0" placeholder="Commit message" id="commit" onfocus="this.select()">
                                        <span class="input-group-btn">
                                            <button data-clipboard-text :data-clipboard-text="getCommit()" type="button" class="btn btn-dark bl-0" data-toggle="tooltip" data-placement="bottom" data-original-title="Copy commit to clipboard."><i class="fal fa-copy"></i></button>
                                        </span>
									</div>
								</div>
							</div>
							<div class="form-row">
								<div class="col-12 col-sm-3 text-left mt-2 my-3 pl-3 px-0">
									<div class="custom-control custom-checkbox pl-0">
										<input type="checkbox" class="custom-control-input" v-model="config.cs" id="cs">
										<label class="custom-control-label" for="cs">Convert emoji to cheat sheet</label>
									</div>
								</div>
								<div class="col-12 col-sm-3 text-left mt-2 my-3 px-0">
									<div class="custom-control custom-checkbox pl-0">
										<input type="checkbox" class="custom-control-input" v-model="config.command" id="command">
										<label class="custom-control-label" for="command">Convert to command</label>
									</div>
								</div>
							</div>
						</div>`,
                data() {
                    return {
                        commit: '',
                        type: '',
                        commitTypes: commitTypes,
                        config: this.$storage.get('committer', {
                            cs: 0,
                            command: 0
                        })
                    }
                },
                methods: {
                    setConfig(name, value) {
                        this.$storage.set(name, value, { ttl: 5571540807106 })
                    },
                    getCommit() {
                        if (!this.type || !this.commit) return '';
                        var cType = this.type;
                        var type = this.config.cs ? cType.github : cType.emoji;
                        var type = (this.config.cs ? ':' : '') + type + (this.config.cs ? ':' : '');
                        if (this.config.command) {
                            return `git commit -m '${type} ${this.commit}'`;
                        }
                        return type + ' ' + this.commit;
                    },
                },
                watch: {
                    config: {
                        handler(val) {
                            this.setConfig('committer', val)
                        },
                        deep: true
                    },
                    type(val, old) {
                        var desc = val.desc,
                            oldDesc = old?.desc;

                        if (this.commit === oldDesc || !this.commit) {
                            this.commit = desc;
                        }
                    },
                },
                mounted() {
                    ttp();
                    new ClipboardJS('[data-clipboard-text]');
                },
            }),
            route('/random', {
                template: `<div class="mt-5 text-center" style="padding-top:7%">
							<h1 class="mb-3" style="color:#06f"><i class="octicon octicon-git-commit"></i> Commit generator</h1>
							<h6 class="mt-3 mb-5" style="color:#999">Commit your way!</h6>
							<div v-if="configs.showDays" class="form-row mb-3">
								<h4 v-for="(item, index) in Object.values(days).slice(-7)" class="mr-4" :style="{color:[index%2?colors[0]:colors[1]]}">{{Object.keys(days).slice(-7)[index]}} ({{item}})</h4>
								<!--<h4 class="mr-2" style="color:MediumSeaGreen">Thu, 12</h4>
								<h4 class="mr-2" style="color:tomato">Thu, 13</h4>-->
							</div>
							<div class="form-row justify-content-center align-items-center">
								<div class="col-10 col-sm-12 my-1">
									<div class="input-group">
										<span class="input-group-btn"><button @click="back" type="button" class="btn btn-dark br-0" data-toggle="tooltip" data-placement="bottom" data-original-title="Back 1 day"><i class="zmdi zmdi-neg-1"></i></button><button @click="showCalendar" type="button" class="btn btn-dark blr-0" data-toggle="tooltip" data-placement="bottom" data-original-title="Set new date"><i class="fal fa-calendar-alt"></i></button><button @click="advance" type="button" class="btn btn-dark blr-0"" data-toggle="tooltip" data-placement="bottom" data-original-title="Advance 1 day"><i class="zmdi zmdi-plus-1"></i></button><button @click="newCommit(1)" data-clipboard-text data-clipboard-target="#commit" type="button" class="btn btn-dark blr-0"" data-toggle="tooltip" data-placement="bottom" data-original-title="Get a new commit and copy"><i class="fal fa-sync"></i></button><button data-clipboard-text data-clipboard-target="#commit" type="button" class="btn btn-dark blr-0"" data-toggle="tooltip" data-placement="bottom" data-original-title="Copy commit to clipboard."><i class="fal fa-copy"></i></button><button @click="toogleOptions" :class="{active:configs.options}" type="button" class="btn btn-dark blr-0"" data-toggle="tooltip" data-placement="bottom" :data-original-title="configs.optionsLabel"><i class="fal fa-ellipsis-h-alt"></i></button></span>
										<input v-model="commit" style="border-radius:.25rem" class="form-control bl-0" placeholder="git commit -m 'Commit message'" id="commit" onfocus="this.select()">
									</div>
								</div>
							</div>
                            <vuejs-datepicker v-model="date"></vuejs-datepicker>
							<div v-if="configs.options" class="form-row">
								<div class="col-10 col-sm-2 mt-2 my-3 ml-2 px-0">
									<div class="custom-control custom-switch pl-1">
										<input type="checkbox" class="custom-control-input" id="rmsg" v-model="configs.rmsg">
										<label class="custom-control-label" for="rmsg">Random message</label>
									</div>
								</div>
								<div v-if="!configs.rmsg" class="col-10 col-sm-2 mt-2 mr-4 px-0">
									<input type="text" class="form-control" placeholder="Commit message" v-model="configs.msg" id="msg">
								</div>
								<div class="col-10 col-sm-2 mt-2 my-3 px-0">
									<div class="custom-control custom-switch pl-1">
										<input type="checkbox" class="custom-control-input" id="rdate" v-model="configs.rdate">
										<label class="custom-control-label" for="rdate">Random date</label>
									</div>
								</div>
								<div v-if="!configs.rdate" class="col-10 col-sm-2 mt-2 mr-2 px-0">
									<input type="text" class="form-control" placeholder="Commit date" v-model="configs.dateFormated" id="date">
								</div>
								<div class="col-10 col-sm-2 mt-2 my-1 ml-2 mr-4 px-0">
									<select :value="configs.format" @change="setFormat($event.target.value)" class="custom-select">
										<option value="0" disabled>Date format</option>
										<option value="1">Timestamp</option>
										<option value="2">ISO 8601</option>
										<option value="3">RFC 2822</option>
									</select>
								</div>
								<div class="col-10 col-sm-1 mt-2 my-3 ml-3 px-0">
									<div class="custom-control custom-checkbox pl-0">
										<input type="checkbox" class="custom-control-input" v-model="configs.gad" id="gad">
										<label class="custom-control-label" for="gad">Author date</label>
									</div>
								</div>
								<div class="col-10 col-sm-2 mt-2 my-3 ml-2 px-0">
									<div class="custom-control custom-checkbox pl-0">
										<input type="checkbox" class="custom-control-input" v-model="configs.gcd" id="gcd">
										<label class="custom-control-label" for="gcd">Committer date</label>
									</div>
								</div>
								<div class="col-10 col-sm-2 mt-2 my-3 ml-2 px-0">
									<div class="custom-control custom-checkbox pl-0">
										<input type="checkbox" class="custom-control-input" v-model="configs.showDays" id="showDays">
										<label class="custom-control-label" for="showDays">Count date</label>
									</div>
								</div>
							</div>
						</div>`,
                data() {
                    return {
                        colors: [this.getRandomColor(), this.getRandomColor()],
                        days: {},
                        commit: '',
                        date: new Date(),
                        dateFormat: '',
                        configs: this.$storage.get('configs', {
                            showDays: 0,
                            msg: '',
                            dateFormated: '',
                            format: 2,
                            options: 0,
                            optionsLabel: 'Show advanced opitions',
                            rmsg: 1,
                            rdate: 1,
                            gad: 1,
                            gcd: 1,
                        })
                    }
                },
                methods: {
                    getRandomColor() {
                        var letters = '0123456789ABCDEF', color = '#8';
                        for (var i = 0; i < 5; i++) {
                            color += letters[Math.floor(Math.random() * 16)];
                        }
                        return color;
                    },
                    aday(day) {
                        this.days[day] = this.days[day] ? ++this.days[day] : 1;
                    },
                    sl(name, value) {
                        this.$storage.set(name, value, { ttl: 1571540807106 })
                    },
                    sd(v) {
                        this.date = new Date(this.date.setDate(v));
                    },
                    back() {
                        hideTtp();
                        this.sd(this.date.getDate() - 1);
                    },
                    advance() {
                        hideTtp();
                        this.sd(this.date.getDate() + 1);
                    },
                    showCalendar() {
                        hideTtp(); hideTtp();
                        this.$children[0].showCalendar();
                    },
                    toogleOptions() {
                        this.configs.options = !this.configs.options;
                        this.configs.optionsLabel = `${this.configs.options ? 'Hide' : 'Show'} advanced opitions`;
                        (ttp = document.querySelector(".tooltip.show .tooltip-inner")) && (ttp.innerHTML = this.configs.optionsLabel);
                        hideTtp();
                    },
                    setFormat(id) {
                        this.configs.format != id && (this.configs.format = id);
                        this.dateFormat = id == '1' ? 'X' : (id == '2' ? 'YYYY-MM-DDT:timeZZ' : 'ddd, DD MMM YYYY :time ZZ');
                        this.newCommit(1);
                    },
                    newCommit(nn = 0) {
                        hideTtp();
                        if (this.configs.rdate && (!this.configs.dateFormated || nn))
                            this.configs.showDays && this.aday(moment(this.date).locale('pt').format('ddd, DD')), this.configs.dateFormated = moment(this.date).format(this.dateFormat.replace(new RegExp("(?:(\:time))", "g"), this.randHMS()));
                        if (this.configs.rmsg && (!this.configs.msg || nn))
                            this.configs.msg = Math.random().toString(16).slice(2);
                        this.commit = `git add -A && ${this.configs.gad ? `GIT_AUTHOR_DATE='${this.configs.dateFormated}' ` : ''}${this.configs.gcd ? `GIT_COMMITTER_DATE='${this.configs.dateFormated}' ` : ''}git commit -m '${this.configs.msg}'`
                    },
                    randHMS(delimiter = ':') {
                        //return `${this.getRandomInt(8,19)}${delimiter}${this.getRandomInt(1,59)}${delimiter}${this.getRandomInt(1,59)}`
                        return this.getRandomInt(8, 19) + delimiter + this.getRandomInt(1, 59) + delimiter + this.getRandomInt(1, 59)
                    },
                    getRandomInt(min, max) {
                        min = Math.ceil(min);
                        max = Math.floor(max);
                        num = Math.floor(Math.random() * (max - min + 1)) + min;
                        return num < 10 ? '0' + num : num;
                    }
                },
                watch: {
                    date(date) {
                        this.newCommit(1)
                    },
                    configs: {
                        handler(val) {
                            this.sl('configs', val)
                        },
                        deep: true
                    },
                    'configs.rmsg': function (val) {
                        if (!val) {
                            setTimeout(() => { document.getElementById('msg').focus() }, 50);
                            return;
                        }
                        this.newCommit(1);
                    },
                    'configs.rdate': function (val) {
                        if (!val) {
                            setTimeout(() => { document.getElementById('date').focus() }, 50);
                            return;
                        }
                        this.newCommit(1);
                    },
                    'configs.gad': function (val) {
                        this.newCommit()
                    },
                    'configs.gcd': function (val) {
                        this.newCommit()
                    }
                },
                mounted() {
                    ttp();
                    this.setFormat(this.configs.format);
                    new ClipboardJS('[data-clipboard-text]');
                },
                components: { vuejsDatepicker }
            }),
            route('*', { template: '<div id="notfound"><div class="notfound"><div class="notfound-404"><h1>4<span></span>4</h1></div><h4>Oops! Page Not Be Found</h4><p>Sorry but the page you are looking for does not exist, have been removed. name changed or is temporarily unavailable</p><router-link to="/"><i class="fas fa-arrow-circle-left"></i> Back to homepage</router-link></div></div>' })
        ]
    }),
}).$mount('#app')