{
 "patcher": {
  "fileversion": 1,
  "appversion": {
   "major": 8,
   "minor": 6,
   "revision": 5,
   "architecture": "x64",
   "modernui": 1
  },
  "classnamespace": "box",
  "rect": [
   120,
   90,
   1060,
   742
  ],
  "openinpresentation": 1,
  "title": "CMPE / Tape + Drifting Memory",
  "bgcolor": [
   1.0,
   1.0,
   1.0,
   1.0
  ],
  "default_fontsize": 13,
  "boxes": [
   {
    "box": {
     "id": "inL",
     "maxclass": "inlet",
     "patching_rect": [
      20,
      20,
      25,
      25
     ],
     "index": 1,
     "comment": "CMPE program left"
    }
   },
   {
    "box": {
     "id": "inR",
     "maxclass": "inlet",
     "patching_rect": [
      70,
      20,
      25,
      25
     ],
     "index": 2,
     "comment": "CMPE program right"
    }
   },
   {
    "box": {
     "id": "controlIn",
     "maxclass": "inlet",
     "patching_rect": [
      120,
      20,
      25,
      25
     ],
     "index": 3,
     "comment": "Effects and recorder commands"
    }
   },
   {
    "box": {
     "id": "tape",
     "maxclass": "newobj",
     "patching_rect": [
      20,
      80,
      180,
      22
     ],
     "text": "poly~ cmpe_fx_tape 1",
     "varname": "tape"
    }
   },
   {
    "box": {
     "id": "memory",
     "maxclass": "newobj",
     "patching_rect": [
      20,
      220,
      180,
      22
     ],
     "text": "cmpe_fx_memory",
     "varname": "memory"
    }
   },
   {
    "box": {
     "id": "controller",
     "maxclass": "newobj",
     "patching_rect": [
      400,
      80,
      190,
      22
     ],
     "text": "js cmpe_fx_control.js",
     "varname": "fx_control"
    }
   },
   {
    "box": {
     "id": "ui",
     "maxclass": "jsui",
     "patching_rect": [
      400,
      140,
      1040,
      596
     ],
     "filename": "cmpe_fx_ui.js",
     "varname": "fx_canvas",
     "presentation": 1,
     "presentation_rect": [
      10,
      8,
      1040,
      596
     ],
     "parameter_enable": 0
    }
   },
   {
    "box": {
     "id": "load",
     "maxclass": "newobj",
     "patching_rect": [
      400,
      20,
      80,
      22
     ],
     "text": "loadbang"
    }
   },
   {
    "box": {
     "id": "tapeMix",
     "maxclass": "newobj",
     "patching_rect": [
      220,
      80,
      100,
      22
     ],
     "text": "line~ 0.",
     "varname": "tape_mix"
    }
   },
   {
    "box": {
     "id": "inv",
     "maxclass": "newobj",
     "patching_rect": [
      220,
      120,
      80,
      22
     ],
     "text": "!-~ 1."
    }
   },
   {
    "box": {
     "id": "tdL",
     "maxclass": "newobj",
     "patching_rect": [
      20,
      125,
      50,
      22
     ],
     "text": "*~"
    }
   },
   {
    "box": {
     "id": "twL",
     "maxclass": "newobj",
     "patching_rect": [
      20,
      155,
      50,
      22
     ],
     "text": "*~"
    }
   },
   {
    "box": {
     "id": "tsL",
     "maxclass": "newobj",
     "patching_rect": [
      20,
      185,
      50,
      22
     ],
     "text": "+~"
    }
   },
   {
    "box": {
     "id": "tdR",
     "maxclass": "newobj",
     "patching_rect": [
      150,
      125,
      50,
      22
     ],
     "text": "*~"
    }
   },
   {
    "box": {
     "id": "twR",
     "maxclass": "newobj",
     "patching_rect": [
      150,
      155,
      50,
      22
     ],
     "text": "*~"
    }
   },
   {
    "box": {
     "id": "tsR",
     "maxclass": "newobj",
     "patching_rect": [
      150,
      185,
      50,
      22
     ],
     "text": "+~"
    }
   },
   {
    "box": {
     "id": "run",
     "maxclass": "newobj",
     "patching_rect": [
      230,
      250,
      100,
      22
     ],
     "text": "line~ 0.",
     "varname": "fx_run"
    }
   },
   {
    "box": {
     "id": "gateL",
     "maxclass": "newobj",
     "patching_rect": [
      20,
      280,
      50,
      22
     ],
     "text": "*~"
    }
   },
   {
    "box": {
     "id": "gateR",
     "maxclass": "newobj",
     "patching_rect": [
      150,
      280,
      50,
      22
     ],
     "text": "*~"
    }
   },
   {
    "box": {
     "id": "absL",
     "maxclass": "newobj",
     "patching_rect": [
      20,
      320,
      60,
      22
     ],
     "text": "abs~"
    }
   },
   {
    "box": {
     "id": "absR",
     "maxclass": "newobj",
     "patching_rect": [
      150,
      320,
      60,
      22
     ],
     "text": "abs~"
    }
   },
   {
    "box": {
     "id": "max",
     "maxclass": "newobj",
     "patching_rect": [
      70,
      350,
      100,
      22
     ],
     "text": "maximum~"
    }
   },
   {
    "box": {
     "id": "ceiling",
     "maxclass": "newobj",
     "patching_rect": [
      70,
      380,
      330,
      22
     ],
     "text": "gen~",
     "patcher": {
      "fileversion": 1,
      "classnamespace": "dsp.gen",
      "rect": [
       0,
       0,
       520,
       200
      ],
      "boxes": [
       {
        "box": {
         "id": "in",
         "maxclass": "newobj",
         "text": "in 1",
         "patching_rect": [
          20,
          20,
          50,
          22
         ]
        }
       },
       {
        "box": {
         "id": "code",
         "maxclass": "codebox",
         "code": "out1 = min(1, 0.98 / max(in1, 0.000001));",
         "numinlets": 1,
         "numoutlets": 1,
         "patching_rect": [
          20,
          60,
          420,
          60
         ]
        }
       },
       {
        "box": {
         "id": "out",
         "maxclass": "newobj",
         "text": "out 1",
         "patching_rect": [
          20,
          150,
          50,
          22
         ]
        }
       }
      ],
      "lines": [
       {
        "patchline": {
         "source": [
          "in",
          0
         ],
         "destination": [
          "code",
          0
         ]
        }
       },
       {
        "patchline": {
         "source": [
          "code",
          0
         ],
         "destination": [
          "out",
          0
         ]
        }
       }
      ]
     }
    }
   },
   {
    "box": {
     "id": "recorder",
     "maxclass": "newobj",
     "patching_rect": [
      390,
      430,
      120,
      22
     ],
     "text": "sfrecord~ 2",
     "varname": "fx_recorder"
    }
   },
   {
    "box": {
     "id": "scope",
     "maxclass": "scope~",
     "patching_rect": [
      400,
      760,
      1010,
      100
     ],
     "varname": "fx_scope",
     "presentation": 1,
     "presentation_rect": [
      28,
      614,
      1004,
      86
     ],
     "bufsize": 256,
     "calccount": 8,
     "range": [
      -1.0,
      1.0
     ],
     "bgcolor": [
      0.9372549019607843,
      0.9568627450980393,
      0.9764705882352941,
      1.0
     ],
     "fgcolor": [
      0.09019607843137255,
      0.30980392156862746,
      0.796078431372549,
      1.0
     ],
     "gridcolor": [
      0.7490196078431373,
      0.8,
      0.8588235294117647,
      1.0
     ]
    }
   },
   {
    "box": {
     "id": "outgainL",
     "maxclass": "newobj",
     "patching_rect": [
      20,
      420,
      50,
      22
     ],
     "text": "*~"
    }
   },
   {
    "box": {
     "id": "outL",
     "maxclass": "outlet",
     "patching_rect": [
      20,
      480,
      25,
      25
     ],
     "index": 1,
     "comment": "Processed L"
    }
   },
   {
    "box": {
     "id": "peakL",
     "maxclass": "newobj",
     "patching_rect": [
      20,
      520,
      110,
      22
     ],
     "text": "peakamp~ 50"
    }
   },
   {
    "box": {
     "id": "ppeakL",
     "maxclass": "newobj",
     "patching_rect": [
      20,
      550,
      120,
      22
     ],
     "text": "prepend level L"
    }
   },
   {
    "box": {
     "id": "outgainR",
     "maxclass": "newobj",
     "patching_rect": [
      150,
      420,
      50,
      22
     ],
     "text": "*~"
    }
   },
   {
    "box": {
     "id": "outR",
     "maxclass": "outlet",
     "patching_rect": [
      150,
      480,
      25,
      25
     ],
     "index": 2,
     "comment": "Processed R"
    }
   },
   {
    "box": {
     "id": "peakR",
     "maxclass": "newobj",
     "patching_rect": [
      150,
      520,
      110,
      22
     ],
     "text": "peakamp~ 50"
    }
   },
   {
    "box": {
     "id": "ppeakR",
     "maxclass": "newobj",
     "patching_rect": [
      150,
      550,
      120,
      22
     ],
     "text": "prepend level R"
    }
   },
   {
    "box": {
     "id": "time",
     "maxclass": "newobj",
     "patching_rect": [
      390,
      480,
      130,
      22
     ],
     "text": "snapshot~ 250"
    }
   },
   {
    "box": {
     "id": "ptime",
     "maxclass": "newobj",
     "patching_rect": [
      390,
      520,
      130,
      22
     ],
     "text": "prepend elapsed"
    }
   },
   {
    "box": {
     "id": "dialog",
     "maxclass": "newobj",
     "patching_rect": [
      600,
      80,
      140,
      22
     ],
     "text": "savedialog WAVE"
    }
   },
   {
    "box": {
     "id": "path",
     "maxclass": "newobj",
     "patching_rect": [
      600,
      120,
      150,
      22
     ],
     "text": "prepend recordpath"
    }
   },
   {
    "box": {
     "id": "feedback",
     "maxclass": "outlet",
     "patching_rect": [
      600,
      200,
      25,
      25
     ],
     "index": 3,
     "comment": "Settings and recorder status"
    }
   },
   {
    "box": {
     "id": "scopeLabel",
     "maxclass": "comment",
     "patching_rect": [
      28,
      704,
      1000,
      23
     ],
     "text": "PROCESSED STEREO FIELD \u00b7 live signal \u00b7 before listening volume",
     "presentation": 1,
     "presentation_rect": [
      28,
      706,
      1000,
      23
     ],
     "textcolor": [
      0.27450980392156865,
      0.3254901960784314,
      0.396078431372549,
      1.0
     ],
     "fontsize": 13
    }
   },
   {
    "box": {
     "id": "cancel",
     "maxclass": "message",
     "text": "recordcancel",
     "patching_rect": [
      760,
      160,
      100,
      22
     ]
    }
   },
   {
    "box": {
     "id": "windowlock",
     "maxclass": "newobj",
     "text": "loadmess locked 1",
     "patching_rect": [
      760,
      30,
      150,
      22
     ]
    }
   },
   {
    "box": {
     "id": "windowctl",
     "maxclass": "newobj",
     "text": "thispatcher",
     "patching_rect": [
      760,
      60,
      100,
      22
     ]
    }
   }
  ],
  "lines": [
   {
    "patchline": {
     "source": [
      "load",
      0
     ],
     "destination": [
      "controller",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "controlIn",
      0
     ],
     "destination": [
      "controller",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ui",
      0
     ],
     "destination": [
      "controller",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "controller",
      0
     ],
     "destination": [
      "tape",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "controller",
      1
     ],
     "destination": [
      "memory",
      2
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "controller",
      2
     ],
     "destination": [
      "ui",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "tapeMix",
      0
     ],
     "destination": [
      "inv",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "inL",
      0
     ],
     "destination": [
      "tape",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "inL",
      0
     ],
     "destination": [
      "tdL",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "inv",
      0
     ],
     "destination": [
      "tdL",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "tape",
      0
     ],
     "destination": [
      "twL",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "tapeMix",
      0
     ],
     "destination": [
      "twL",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "tdL",
      0
     ],
     "destination": [
      "tsL",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "twL",
      0
     ],
     "destination": [
      "tsL",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "tsL",
      0
     ],
     "destination": [
      "memory",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "inR",
      0
     ],
     "destination": [
      "tape",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "inR",
      0
     ],
     "destination": [
      "tdR",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "inv",
      0
     ],
     "destination": [
      "tdR",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "tape",
      1
     ],
     "destination": [
      "twR",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "tapeMix",
      0
     ],
     "destination": [
      "twR",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "tdR",
      0
     ],
     "destination": [
      "tsR",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "twR",
      0
     ],
     "destination": [
      "tsR",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "tsR",
      0
     ],
     "destination": [
      "memory",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "memory",
      0
     ],
     "destination": [
      "gateL",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "run",
      0
     ],
     "destination": [
      "gateL",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "memory",
      1
     ],
     "destination": [
      "gateR",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "run",
      0
     ],
     "destination": [
      "gateR",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "gateL",
      0
     ],
     "destination": [
      "absL",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "gateR",
      0
     ],
     "destination": [
      "absR",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "absL",
      0
     ],
     "destination": [
      "max",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "absR",
      0
     ],
     "destination": [
      "max",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "max",
      0
     ],
     "destination": [
      "ceiling",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "gateL",
      0
     ],
     "destination": [
      "outgainL",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ceiling",
      0
     ],
     "destination": [
      "outgainL",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "outgainL",
      0
     ],
     "destination": [
      "outL",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "outgainL",
      0
     ],
     "destination": [
      "recorder",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "outgainL",
      0
     ],
     "destination": [
      "scope",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "outgainL",
      0
     ],
     "destination": [
      "peakL",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "peakL",
      0
     ],
     "destination": [
      "ppeakL",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ppeakL",
      0
     ],
     "destination": [
      "controller",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "gateR",
      0
     ],
     "destination": [
      "outgainR",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ceiling",
      0
     ],
     "destination": [
      "outgainR",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "outgainR",
      0
     ],
     "destination": [
      "outR",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "outgainR",
      0
     ],
     "destination": [
      "recorder",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "outgainR",
      0
     ],
     "destination": [
      "scope",
      1
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "outgainR",
      0
     ],
     "destination": [
      "peakR",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "peakR",
      0
     ],
     "destination": [
      "ppeakR",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ppeakR",
      0
     ],
     "destination": [
      "controller",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "recorder",
      0
     ],
     "destination": [
      "time",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "time",
      0
     ],
     "destination": [
      "ptime",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "ptime",
      0
     ],
     "destination": [
      "controller",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "controller",
      3
     ],
     "destination": [
      "dialog",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "dialog",
      0
     ],
     "destination": [
      "path",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "path",
      0
     ],
     "destination": [
      "controller",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "controller",
      4
     ],
     "destination": [
      "feedback",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "dialog",
      1
     ],
     "destination": [
      "cancel",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "cancel",
      0
     ],
     "destination": [
      "controller",
      0
     ]
    }
   },
   {
    "patchline": {
     "source": [
      "windowlock",
      0
     ],
     "destination": [
      "windowctl",
      0
     ]
    }
   }
  ],
  "editing_bgcolor": [
   1.0,
   1.0,
   1.0,
   1.0
  ]
 }
}