/*
 * get the file handler
 */
var fs = require('fs');
var path = require('path');

Object.defineProperties(Object.prototype, {
	apply : {
		value: function(config, defaults) {
			if (defaults) {
				this.apply(defaults);
			};
			if (config && typeof config === 'object') {
				var i;
				for (i in config) {
				    this[i] = config[i];
				}
			};    
			return this;
		},
		writable: false,
		enumerable: false,
		configurable: false
	},
	applyIf : {
		value: function(config) {
			var property;
			for (property in config) {
				if (!this.hasOwnProperty(property)) {
				    this[property] = config[property];
				}
			}
			return this;
		},
		writable: false,
		enumerable: false,
		configurable: false
	}
});

/*
 * define the possible values:
 * section: [section]
 * param: key=value
 * comment: ;this is a comment
 * comment: #this is a comment
 */
var regex = {
	section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
	param: /^\s*([\w\.\-\_]+)\s*=\s*(.*)\s*$/,
	comment: /\s*(#|;).*$/,
	
};

Object.defineProperties(module.exports, {
	config : {
		set: function (x) {
			if(x)
	            regex = x;
        },
        get: function () {
           return {
				init : {
					section: /^\s*\[\s*([^\]]*)\s*\]\s*$/,
					param: /^\s*([\w\.\-\_]+)\s*=\s*(.*)\s*$/,
					comment: /\s*;.*$/
				},
				conf : {
					section: /^group\s*=\s*([^\t\n\r\f\b]*)\s*$/i,
					param: /^\s*([\w\.\-\_]+)\s*=\s*(.*)\s*$/,
					comment: /\s*#.*$/,
					include : /^include\s*=\s*([^\t\n\r\f\b]*)\s*$/i,
					ext : /\.(conf|cnf)/i
				}
			};
        },
        enumerable: true,
        configurable: true
		
	}
});


function getData(str){
	if(str.toLowerCase() === "true")
		return true;
	if(str.toLowerCase() === "false")
		return false;
	if(!isNaN(str))
		return Number(str);
	if(/['"]/.test(str[0]) && /['"]/.test(str[str.length-1]))
		return str.substr(1,str.length-2);
	return str;
}

/*
 * parses a kannel.conf file
 * @param: {String} file, the location of the .ini file
 * @param: {Function} callback, the function that will be called when parsing is done
 * @return: none
 */
module.exports.parse = function(file, s, callback){
	if(!callback){
		return;
	}
	s = Boolean(s);
	fs.readFile(file, 'utf8', function(err, data){
		if(err){
			callback(err);
		}else{
			callback(null, parse(data,s));
		}
	});
};

module.exports.parseSync = function(file,s){
	s = Boolean(s);
	return parse(fs.readFileSync(file, 'utf8'),s);
};

function parse(data,s){
	s = Boolean(s);
	var value = {};
	var lines = data.split(/\r\n|\r|\n/);
	var section = null;
	var includeFile = {};
	lines.forEach(function(line){
		line = line.replace(regex.comment,"");
		if("include" in regex && regex.include.test(line)){
			var match = line.match(regex.include);
			if(path.existsSync(match[1])){;
				var a = fs.statSync(match[1]);
				if(a.isDirectory()){
					fs.readdirSync(match[1]).
						forEach(function(file){
							if("ext" in regex && regex.ext.test(file)){
								try{
									var b = path.join(match[1],file);
									if(!(b in includeFile)){
										includeFile[b] = true;
										value.apply(module.exports.parseSync(b,s));
									}else{};
								}catch(e){};
							}
						})
				}else if(a.isFile()){
					try{
						if(!(match[1] in includeFile)){
							includeFile[match[1]] = true;
							value.apply(module.exports.parseSync(match[1],s));
						}else{};
					}catch(e){};
				}
				
			}
		}else if("section" in regex && s && regex.section.test(line)){
			var match = line.match(regex.section);
			value[match[1]] = value[match[1]] ||  [];
			value[match[1]][value[match[1]].length] = [];
			section = [match[1],value[match[1]].length -1];
		}else if("param" in regex && regex.param.test(line)){
			var match = line.match(regex.param);
			match[2] = getData(match[2]);
			if(section){
				//console.log("value[",section[0],"][",section[1],"][",match[1],"] = ",match[2],";");
				value[section[0]][section[1]][match[1]] = match[2];
			}else{
				value[match[1]] = match[2];
			}
		};
	});
	//console.log("Value Is ",value);
	return value;
}

module.exports.parseString = parse;