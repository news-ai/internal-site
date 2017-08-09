const schema = {
  "data": {
    "md1": {
      "mappings": {
        "contacts": {
          "properties": {
            "data": {
              "properties": {
                "contactInfo": {
                  "properties": {
                    "familyName": {
                      "index": "not_analyzed",
                      "type": "string"
                    },
                    "fullName": {
                      "index": "not_analyzed",
                      "type": "string"
                    },
                    "givenName": {
                      "index": "not_analyzed",
                      "type": "string"
                    },
                    "websites": {
                      "properties": {
                        "url": {
                          "index": "not_analyzed",
                          "type": "string"
                        }
                      }
                    }
                  }
                },
                "created": {
                  "format": "strict_date_optional_time||epoch_millis",
                  "type": "date"
                },
                "demographics": {
                  "properties": {
                    "gender": {
                      "index": "not_analyzed",
                      "type": "string"
                    },
                    "locationDeduced": {
                      "properties": {
                        "city": {
                          "properties": {
                            "name": {
                              "index": "not_analyzed",
                              "type": "string"
                            }
                          }
                        },
                        "continent": {
                          "properties": {
                            "deduced": {
                              "type": "boolean"
                            },
                            "name": {
                              "index": "not_analyzed",
                              "type": "string"
                            }
                          }
                        },
                        "country": {
                          "properties": {
                            "code": {
                              "index": "not_analyzed",
                              "type": "string"
                            },
                            "deduced": {
                              "type": "boolean"
                            },
                            "name": {
                              "index": "not_analyzed",
                              "type": "string"
                            }
                          }
                        },
                        "deducedLocation": {
                          "index": "not_analyzed",
                          "type": "string"
                        },
                        "likelihood": {
                          "type": "long"
                        },
                        "normalizedLocation": {
                          "index": "not_analyzed",
                          "type": "string"
                        },
                        "state": {
                          "properties": {
                            "code": {
                              "index": "not_analyzed",
                              "type": "string"
                            },
                            "name": {
                              "index": "not_analyzed",
                              "type": "string"
                            }
                          }
                        }
                      }
                    },
                    "locationGeneral": {
                      "index": "not_analyzed",
                      "type": "string"
                    }
                  }
                },
                "digitalFootprint": {
                  "properties": {
                    "scores": {
                      "properties": {
                        "provider": {
                          "index": "not_analyzed",
                          "type": "string"
                        },
                        "type": {
                          "index": "not_analyzed",
                          "type": "string"
                        },
                        "value": {
                          "type": "long"
                        }
                      }
                    },
                    "topics": {
                      "properties": {
                        "provider": {
                          "index": "not_analyzed",
                          "type": "string"
                        },
                        "value": {
                          "index": "not_analyzed",
                          "type": "string"
                        }
                      }
                    }
                  }
                },
                "email": {
                  "index": "not_analyzed",
                  "type": "string"
                },
                "isOutdated": {
                  "type": "boolean"
                },
                "likelihood": {
                  "type": "double"
                },
                "organizations": {
                  "properties": {
                    "endDate": {
                      "format": "strict_date_optional_time||epoch_millis",
                      "type": "date"
                    },
                    "name": {
                      "index": "not_analyzed",
                      "type": "string"
                    },
                    "startDate": {
                      "format": "strict_date_optional_time||epoch_millis",
                      "type": "date"
                    },
                    "title": {
                      "index": "not_analyzed",
                      "type": "string"
                    }
                  }
                },
                "photos": {
                  "properties": {
                    "isPrimary": {
                      "type": "boolean"
                    },
                    "type": {
                      "index": "not_analyzed",
                      "type": "string"
                    },
                    "typeId": {
                      "index": "not_analyzed",
                      "type": "string"
                    },
                    "typeName": {
                      "index": "not_analyzed",
                      "type": "string"
                    },
                    "url": {
                      "index": "not_analyzed",
                      "type": "string"
                    }
                  }
                },
                "requestId": {
                  "index": "not_analyzed",
                  "type": "string"
                },
                "socialProfiles": {
                  "properties": {
                    "bio": {
                      "index": "not_analyzed",
                      "type": "string"
                    },
                    "id": {
                      "index": "not_analyzed",
                      "type": "string"
                    },
                    "type": {
                      "index": "not_analyzed",
                      "type": "string"
                    },
                    "typeId": {
                      "index": "not_analyzed",
                      "type": "string"
                    },
                    "typeName": {
                      "index": "not_analyzed",
                      "type": "string"
                    },
                    "url": {
                      "index": "not_analyzed",
                      "type": "string"
                    },
                    "username": {
                      "index": "not_analyzed",
                      "type": "string"
                    }
                  }
                },
                "status": {
                  "type": "long"
                },
                "toUpdate": {
                  "type": "boolean"
                },
                "updated": {
                  "format": "strict_date_optional_time||epoch_millis",
                  "type": "date"
                },
                "writingInformation": {
                  "properties": {
                    "beats": {
                      "index": "not_analyzed",
                      "type": "string"
                    },
                    "isFreelancer": {
                      "type": "boolean"
                    },
                    "isInfluencer": {
                      "type": "boolean"
                    },
                    "occasionalBeats": {
                      "index": "not_analyzed",
                      "type": "string"
                    },
                    "rss": {
                      "index": "not_analyzed",
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "included": null
};
export default schema;
