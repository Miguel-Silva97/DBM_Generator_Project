const express = require('express');
var router = express.Router();

var Song = require('../Models/Song.js');
var schemaSong = require('../Schemas/Schema-Song.json');


router.get('/Song', (req,res) => {
    Song.all((rows) => {
        res.render('list', {
            title: 'Backoffice Song',
            name: 'Song',
            columns: function () {
                let prettyNames = [];
                let requiredProps = schemaSong.required;
                
                Object.entries(schemaSong.properties).forEach(prop => {
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
                        link: './Song/Details/' + obj.id,
                        image:{ src: '../../images/read.png', alt: 'read' },
                        tooltip: 'Details'
                        }, {
                        link: './Song/Edit/' + obj.id,
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

router.get('/Song/Details/:id', (req,res) => {
    Song.get(req.params.id, function (row){
        res.render('details', {
            properties: function () {
                let allProps = Object.getOwnPropertyNames(row);
                let validProps = [];

                allProps.forEach((prop) => {
                    if(schemaSong.properties.hasOwnProperty(prop)){
                        validProps.push({
                            name: schemaSong.properties[prop]["prettyName"],
                            value: row[prop]
                        });
                    }
                })
                return validProps;
            },
            references: function () {
                var allRefs = [];
                if (schemaSong.references) {
                schemaSong.references.forEach(function (ref) {
                allRefs.push({
                labelRef: ref.label,
                model: ref.model,
                values: ref.relation === "M-M" ? '/Song/' +
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

router.get('/Song/Insert', (req,res) => {
    
        res.render('insert', {
            labels: function() {
                let allProps = Object.getOwnPropertyNames(new Song());
                let varNames = [];
                allProps.forEach((prop) => {
                    if(schemaSong.properties.hasOwnProperty(prop)){
                        varNames.push({
                            name: prop
                        })
                    }
                })
                return varNames;
            },
            title : "Song",
            properties: function () {
                let allProps = Object.getOwnPropertyNames(new Song());
                let validProps = [];
                let types = {
                    integer: "text",
                    number: "number",
                    string: "text",
                    date: "date",
                };

                
                allProps.forEach((prop) => {
                    if(schemaSong.properties.hasOwnProperty(prop)){
                        validProps.push({
                            name: schemaSong.properties[prop]["prettyName"],
                            correctName: prop,
                            type: types[schemaSong.properties[prop].type],
                            required: schemaSong.required.includes(prop),
                            constraints: function() {
                                let constra = [];
                                let constraintTypes = {
                                    minimum: "min",
                                    maximum: "max",
                                    minLength: "minLength",
                                    maxLength: "maxLength"
                                };
                                Object.keys(constraintTypes).forEach(c => {
                                    if(schemaSong.properties[prop][c] !== undefined) {
                                        constra.push({
                                            name: constraintTypes[c],
                                            constValue: schemaSong.properties[prop][c]
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
                if (schemaSong.references) {
                    schemaSong.references.forEach(function (ref) {
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


router.get('/Song/Edit/:id', (req,res) => {
        Song.get(req.params.id, function (row){
        res.render('edit', {
            
            id: req.params.id,
            labels: function() {
                let allProps = Object.getOwnPropertyNames(new Song());
                let varNames = [];
                allProps.forEach((prop) => {
                    if(schemaSong.properties.hasOwnProperty(prop)){
                        varNames.push({
                            name: prop
                        })
                    }
                })
                return varNames;
            },
            title : "Song",
            properties: function () {
                let allProps = Object.getOwnPropertyNames(new Song());
                let validProps = [];
                let types = {
                    integer: "text",
                    number: "number",
                    string: "text",
                    date: "date",
                };
                
                
                allProps.forEach((prop) => {
                    if(schemaSong.properties.hasOwnProperty(prop)){
                        validProps.push({
                            name: schemaSong.properties[prop]["prettyName"],
                            correctName: prop,
                            type: types[schemaSong.properties[prop].type],
                            value: row[prop],
                            required: schemaSong.required.includes(prop),
                            constraints: function() {
                                let constra = [];
                                let constraintTypes = {
                                    minimum: "min",
                                    maximum: "max",
                                    minLength: "minLength",
                                    maxLength: "maxLength"
                                };
                                Object.keys(constraintTypes).forEach(c => {
                                    if(schemaSong.properties[prop][c] !== undefined) {
                                        constra.push({
                                            name: constraintTypes[c],
                                            constValue: schemaSong.properties[prop][c]
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
                if (schemaSong.references) {
                    schemaSong.references.forEach(function (ref) {
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