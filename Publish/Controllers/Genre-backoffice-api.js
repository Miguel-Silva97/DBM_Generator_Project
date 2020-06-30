const express = require('express');
var router = express.Router();

var Genre = require('../Models/Genre.js');
var schemaGenre = require('../Schemas/Schema-Genre.json');


router.get('/Genre', (req,res) => {
    Genre.all((rows) => {
        res.render('list', {
            title: 'Backoffice Genre',
            name: 'Genre',
            columns: function () {
                let prettyNames = [];
                let requiredProps = schemaGenre.required;
                
                Object.entries(schemaGenre.properties).forEach(prop => {
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
                        link: './Genre/Details/' + obj.id,
                        image:{ src: '../../images/read.png', alt: 'read' },
                        tooltip: 'Details'
                        }, {
                        link: './Genre/Edit/' + obj.id,
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

router.get('/Genre/Details/:id', (req,res) => {
    Genre.get(req.params.id, function (row){
        res.render('details', {
            properties: function () {
                let allProps = Object.getOwnPropertyNames(row);
                let validProps = [];

                allProps.forEach((prop) => {
                    if(schemaGenre.properties.hasOwnProperty(prop)){
                        validProps.push({
                            name: schemaGenre.properties[prop]["prettyName"],
                            value: row[prop]
                        });
                    }
                })
                return validProps;
            },
            references: function () {
                var allRefs = [];
                if (schemaGenre.references) {
                schemaGenre.references.forEach(function (ref) {
                allRefs.push({
                labelRef: ref.label,
                model: ref.model,
                values: ref.relation === "M-M" ? '/Genre/' +
                req.params.id : row[(ref.model + "_id").toLowerCase()]
                     });
                    });
                }
                return allRefs;
                },
                get hasReferences() {
                return this.references().length > 0;
                }

        });
    });
});

router.get('/Genre/Insert', (req,res) => {
    
        res.render('insert', {
            labels: function() {
                let allProps = Object.getOwnPropertyNames(new Genre());
                let varNames = [];
                allProps.forEach((prop) => {
                    if(schemaGenre.properties.hasOwnProperty(prop)){
                        varNames.push({
                            name: prop
                        })
                    }
                })
                return varNames;
            },
            title : "Genre",
            properties: function () {
                let allProps = Object.getOwnPropertyNames(new Genre());
                let validProps = [];
                let types = {
                    integer: "text",
                    number: "number",
                    string: "text",
                    date: "date",
                };

                
                allProps.forEach((prop) => {
                    if(schemaGenre.properties.hasOwnProperty(prop)){
                        validProps.push({
                            name: schemaGenre.properties[prop]["prettyName"],
                            correctName: prop,
                            type: types[schemaGenre.properties[prop].type],
                            required: schemaGenre.required.includes(prop),
                            constraints: function() {
                                let constra = [];
                                let constraintTypes = {
                                    minimum: "min",
                                    maximum: "max",
                                    minLength: "minLength",
                                    maxLength: "maxLength"
                                };
                                Object.keys(constraintTypes).forEach(c => {
                                    if(schemaGenre.properties[prop][c] !== undefined) {
                                        constra.push({
                                            name: constraintTypes[c],
                                            constValue: schemaGenre.properties[prop][c]
                                        })
                                    }
                                })
                                return constra;
                            }
                        });
                    }
                })
                return validProps;
            },
            references: function () {
                var allRefs = [];
                if (schemaGenre.references) {
                    schemaGenre.references.forEach(function (ref) {
                        allRefs.push({
                            label: ref.label,
                            model: ref.model,
                            isManyToMany: ref.relation === "M-M"
                        });
                    });
                }
                    return allRefs;
                },
            get hasReferences() {
                return this.references().length > 0;
                }
        });
    
});


router.get('/Genre/Edit/:id', (req,res) => {
        Genre.get(req.params.id, function (row){
        res.render('edit', {
            
            id: req.params.id,
            labels: function() {
                let allProps = Object.getOwnPropertyNames(new Genre());
                let varNames = [];
                allProps.forEach((prop) => {
                    if(schemaGenre.properties.hasOwnProperty(prop)){
                        varNames.push({
                            name: prop
                        })
                    }
                })
                return varNames;
            },
            title : "Genre",
            properties: function () {
                let allProps = Object.getOwnPropertyNames(new Genre());
                let validProps = [];
                let types = {
                    integer: "text",
                    number: "number",
                    string: "text",
                    date: "date",
                };
                
                
                allProps.forEach((prop) => {
                    if(schemaGenre.properties.hasOwnProperty(prop)){
                        validProps.push({
                            name: schemaGenre.properties[prop]["prettyName"],
                            correctName: prop,
                            type: types[schemaGenre.properties[prop].type],
                            value: row[prop],
                            required: schemaGenre.required.includes(prop),
                            constraints: function() {
                                let constra = [];
                                let constraintTypes = {
                                    minimum: "min",
                                    maximum: "max",
                                    minLength: "minLength",
                                    maxLength: "maxLength"
                                };
                                Object.keys(constraintTypes).forEach(c => {
                                    if(schemaGenre.properties[prop][c] !== undefined) {
                                        constra.push({
                                            name: constraintTypes[c],
                                            constValue: schemaGenre.properties[prop][c]
                                        })
                                    }
                                })
                                return constra;
                            }
                            
                        });
                    }
                })
                return validProps;
            },
            references: function () {
                var allRefs = [];
                if (schemaGenre.references) {
                    schemaGenre.references.forEach(function (ref) {
                        allRefs.push({
                            label: ref.label,
                            model: ref.model,
                            isManyToMany: ref.relation === "M-M"
                        });
                    });
                }
                    return allRefs;
                },
            get hasReferences() {
                return this.references().length > 0;
                }
        });

    });
    
});

module.exports = router;