const express = require('express');
var router = express.Router();

var Artist = require('../Models/Artist.js');
var schemaArtist = require('../Schemas/Schema-Artist.json');


router.get('/Artist', (req,res) => {
    Artist.all((rows) => {
        res.render('list', {
            title: 'Backoffice Artist',
            name: 'Artist',
            columns: function () {
                let prettyNames = [];
                let requiredProps = schemaArtist.required;
                
                Object.entries(schemaArtist.properties).forEach(prop => {
                    prop.forEach(p => {
                        if(p.prettyName !== undefined && requiredProps.includes(prop[0])){
                            prettyNames.push(p.prettyName);
                        }
                    });
                });
                
                return prettyNames;
            },
            rows: rows.map(obj => {
                return {
                    properties: Object.keys(obj).map(key => obj[key]),
                    actions: [{
                        link: './Artist/Details/' + obj.id,
                        image:{ src: '../../images/read.png', alt: 'read' },
                        tooltip: 'Details'
                        }, {
                        link: './Artist/Edit/' + obj.id,
                        image: { src: '../../images/edit.png', alt: 'edit' },
                        tooltip: 'Edit'
                        }, {
                        link: '#',
                        image: { src: '../../images/delete.png', alt: 'delete'},
                        tooltip: 'Delete',
                        events: [{
                        name: "onclick",
                        function: "remove",
                        args: obj.id
                        }]
                    }]
                }
            })
        })
    })
});

router.get('/Artist/Details/:id', (req,res) => {
    Artist.get(req.params.id, function (row){
        res.render('details', {
            properties: function () {
                let allProps = Object.getOwnPropertyNames(row);
                let validProps = [];

                allProps.forEach((prop) => {
                    if(schemaArtist.properties.hasOwnProperty(prop)){
                        validProps.push({
                            name: schemaArtist.properties[prop]["prettyName"],
                            value: row[prop]
                        });
                    }
                })
                return validProps;
            }
        });
    });
});

router.get('/Artist/Insert', (req,res) => {
    
        res.render('insert', {
            properties: function () {
                let allProps = Object.getOwnPropertyNames(new Artist());
                let validProps = [];
                let types = {
                    integer: "text",
                    number: "number",
                    string: "text",
                    date: "date",
                };

                
                allProps.forEach((prop) => {
                    if(schemaArtist.properties.hasOwnProperty(prop)){
                        validProps.push({
                            name: schemaArtist.properties[prop]["prettyName"],
                            type: types[schemaArtist.properties[prop].type],
                            required: schemaArtist.required.includes(prop),
                            constraints: function() {
                                let constra = [];
                                let constraintTypes = {
                                    minimum: "min",
                                    maximum: "max",
                                    minLength: "minLength",
                                    maxLength: "maxLength"
                                };
                                Object.keys(constraintTypes).forEach(c => {
                                    if(schemaArtist.properties[prop][c] !== undefined) {
                                        constra.push({
                                            name: constraintTypes[c],
                                            constValue: schemaArtist.properties[prop][c]
                                        })
                                    }
                                })
                                return constra;
                            }
                        });
                    }
                })
                return validProps;
            }
        });
    
});


router.get('/Artist/Edit/:id', (req,res) => {
        Artist.get(req.params.id, function (row){
        res.render('edit', {
            id: req.params.id,
            properties: function () {
                let allProps = Object.getOwnPropertyNames(new Artist());
                let validProps = [];
                let types = {
                    integer: "text",
                    number: "number",
                    string: "text",
                    date: "date",
                };
                
                
                allProps.forEach((prop) => {
                    if(schemaArtist.properties.hasOwnProperty(prop)){
                        validProps.push({
                            name: schemaArtist.properties[prop]["prettyName"],
                            type: types[schemaArtist.properties[prop].type],
                            value: row[prop],
                            constraints: function() {
                                let constra = [];
                                let constraintTypes = {
                                    minimum: "min",
                                    maximum: "max",
                                    minLength: "minLength",
                                    maxLength: "maxLength"
                                };
                                Object.keys(constraintTypes).forEach(c => {
                                    if(schemaArtist.properties[prop][c] !== undefined) {
                                        constra.push({
                                            name: constraintTypes[c],
                                            constValue: schemaArtist.properties[prop][c]
                                        })
                                    }
                                })
                                return constra;
                            }
                            
                        });
                    }
                })
                return validProps;
            }
        });

    });
    
});

module.exports = router;