const jsdom = require("jsdom");
const path = require("path");


const {JSDOM} = jsdom;


const render = async filename => {
    const filePath = path.join(process.cwd(), filename);

    return await JSDOM.fromFile(filePath, {
        runScripts: 'dangerously',
        resources: 'usable'
    });
};


module.exports = render;
