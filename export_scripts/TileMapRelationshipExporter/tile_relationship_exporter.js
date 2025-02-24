

// function addFriendlyTileInfo(object, tileId, friendlyTileId, direction)
// {
//     var foundTile = false;
//     for (let i = 0; i < object.tiles.length - 1; i++)
//     {
//         if (object.tiles[i].ID == tileId)
//         {
//             foundTile = true;
//             if (direction == "north")
//             {
//                 object.tiles[i].northFriends.push(friendlyTileId)
//             }
//             else if (direction == "east")
//             {
//                 object.tiles[i].eastFriends.push(friendlyTileId)
//             }
//             else if (direction == "south")
//             {
//                 object.tiles[i].southFriends.push(friendlyTileId)
//             }
//             else if (direction == "west")
//             {
//                 object.tiles[i].westFriends.push(friendlyTileId)
//             }
//         }
//     }

//     // If we don't already have the entry, add one here
//     if (!foundTile)
//     {
//         newTile = {
//             Id: tileId,
//             northFriends: [],
//             eastFriends: [],
//             southFriends: [],
//             westFriends: [],
//         };

//         if (direction == "north")
//         {
//             newTile.northFriends.push(friendlyTileId)
//         }
//         else if (direction == "east")
//         {
//             newTile.eastFriends.push(friendlyTileId)
//         }
//         else if (direction == "south")
//         {
//             newTile.southFriends.push(friendlyTileId)
//         }
//         else if (direction == "west")
//         {
//             newTile.westFriends.push(friendlyTileId)
//         }

//         object.tiles.push(newTile);
//     }
// }

var tileRelationshipMapFormat = {
    name: "Tile Relationship Map Format",
    extension: "json",

    /*
     * @param map {TileMap}
     * @param filename {string}
    */
    write: function(map, filename) {
        var tilesetsUsed = map.usedTilesets();
        
        var relationshipObject = {
            tileset: tilesetsUsed[0].name,
            tiles: [],
            tileCount: 0,
        };

        for (var i = 0; i < map.layerCount; ++i) {
            var layer = map.layerAt(i);
            if (layer.isTileLayer) {

                // NOTE: Might be an issue if we had multiple layers
                relationshipObject.tileCount = layer.height * layer.width;

                for (y = 0; y < layer.height; ++y) {
                    for (x = 0; x < layer.width; ++x) {
                        var currentTileId = layer.cellAt(x, y).tileId;

                        // Does this tile exist yet? If so, add the info
                        var foundTile = false;
                        for (j = 0; j < relationshipObject.tiles.length; ++j) {
                            if (relationshipObject.tiles[j].id == currentTileId) {
                                foundTile = true;
                                relationshipObject.tiles[j].frequency += 1;
                                
                                // We want to check if we've added a friend tile already, this is gonna be terrible, apologies
                                if (y > 0) {
                                    var alreadyFriend = false;
                                    for(k = 0; k < relationshipObject.tiles[j].northFriends.length; ++k) {
                                        if (relationshipObject.tiles[j].northFriends[k].id == layer.cellAt(x, y - 1).tileId) {
                                            alreadyFriend = true;
                                            relationshipObject.tiles[j].northFriends[k].appearances += 1;
                                        }
                                    }
                                    
                                    if (!alreadyFriend) {
                                        var tileFriendObject = {
                                            id: layer.cellAt(x, y - 1).tileId,
                                            appearances: 1,
                                        }
                                        relationshipObject.tiles[j].northFriends.push(tileFriendObject);
                                    }
                                }
    
                                if (x < layer.width - 1) {
                                    var alreadyFriend = false;
                                    for(k = 0; k < relationshipObject.tiles[j].eastFriends.length; ++k) {
                                        if (relationshipObject.tiles[j].eastFriends[k].id == layer.cellAt(x + 1, y).tileId) {
                                            alreadyFriend = true;
                                            relationshipObject.tiles[j].eastFriends[k].appearances += 1;
                                        }
                                    }
                                    
                                    if (!alreadyFriend) {
                                        var tileFriendObject = {
                                            id: layer.cellAt(x + 1, y).tileId,
                                            appearances: 1,
                                        }
                                        relationshipObject.tiles[j].eastFriends.push(tileFriendObject);
                                    }
                                }
    
                                if (y < layer.height - 1) {
                                    var alreadyFriend = false;
                                    for(k = 0; k < relationshipObject.tiles[j].southFriends.length; ++k) {
                                        if (relationshipObject.tiles[j].southFriends[k].id == layer.cellAt(x, y + 1).tileId) {
                                            alreadyFriend = true;
                                            relationshipObject.tiles[j].southFriends[k].appearances += 1;
                                        }
                                    }
                                    
                                    if (!alreadyFriend) {
                                        var tileFriendObject = {
                                            id: layer.cellAt(x, y + 1).tileId,
                                            appearances: 1,
                                        }

                                        relationshipObject.tiles[j].southFriends.push(tileFriendObject);
                                    }
                                }
    
                                if (x > 0) {
                                    var alreadyFriend = false;
                                    for(k = 0; k < relationshipObject.tiles[j].westFriends.length; ++k) {
                                        if (relationshipObject.tiles[j].westFriends[k].id == layer.cellAt(x - 1, y).tileId) {
                                            alreadyFriend = true;
                                            relationshipObject.tiles[j].westFriends[k].appearances += 1;
                                        }
                                    }
                                    
                                    if (!alreadyFriend) {
                                        var tileFriendObject = {
                                            id: layer.cellAt(x - 1, y).tileId,
                                            appearances: 1,
                                        }
                                        
                                        relationshipObject.tiles[j].westFriends.push(tileFriendObject);
                                    }
                                }
                            }
                        }

                        // If not, create it!
                        if (!foundTile) {
                            newTile = {
                                id: layer.cellAt(x, y).tileId,
                                northFriends: [],
                                eastFriends: [],
                                southFriends: [],
                                westFriends: [],
                                collision: layer.tileAt(x, y).property("collision"),
                                damage: layer.tileAt(x, y).property("damage"),
                                animRef: layer.tileAt(x, y).property("animRef"),
                                frequency: 1,
                            };

                            if (y > 0) {
                                var tileFriendObject = {
                                    id: layer.cellAt(x, y - 1).tileId,
                                    appearances: 1,
                                }
                                newTile.northFriends.push(tileFriendObject);
                            }

                            if (x < layer.width - 1) {
                                var tileFriendObject = {
                                    id: layer.cellAt(x + 1, y).tileId,
                                    appearances: 1,
                                }
                                newTile.eastFriends.push(tileFriendObject);
                            }

                            if (y < layer.height - 1) {
                                var tileFriendObject = {
                                    id: layer.cellAt(x, y + 1).tileId,
                                    appearances: 1,
                                }
                                newTile.southFriends.push(tileFriendObject);
                            }

                            if (x > 0) {
                                var tileFriendObject = {
                                    id: layer.cellAt(x - 1, y).tileId,
                                    appearances: 1,
                                }
                                newTile.westFriends.push(tileFriendObject);
                            }

                            relationshipObject.tiles.push(newTile);
                        }
                    }
                }
            }
        }

        // console.log("Test Print");

        tiled.log("Print test");

        var file = new TextFile(filename, TextFile.WriteOnly);
        file.write(JSON.stringify(relationshipObject, null, "\t"));
        file.commit();
    },
}

tiled.registerMapFormat("tileRelationships", tileRelationshipMapFormat)