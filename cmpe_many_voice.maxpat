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
      80,
      80,
      1560,
      1760
    ],
    "default_fontsize": 13.0,
    "default_fontname": "Arial",
    "title": "cmpe_many_voice",
    "boxes": [
      {
        "box": {
          "id": "protocol",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            20,
            12,
            1520,
            76
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "Many native voice. Messages: set buffer; rate ratio; amp wetGain; sumgain (1 mono, 0.70710678 stereo); feed inputMultiplier; dryenv/wetenv target/ms pairs;\nstage index delayLms coefficientL delayRms coefficientR; clear; start positionMs; stop; panic. Each of seven allpasses receives feed at its INPUT. Feedback coefficients must be below 1."
        }
      },
      {
        "box": {
          "id": "input",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            20,
            110,
            70,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "in 1",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "route",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 13,
          "patching_rect": [
            20,
            150,
            1520,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "route set rate amp sumgain feed dryenv wetenv stage clear start stop panic",
          "outlettype": [
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
          ]
        }
      },
      {
        "box": {
          "id": "buffer_set",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            20,
            210,
            130,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "prepend set",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "rate",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            180,
            210,
            100,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "sig~ 1.",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "player",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 3,
          "patching_rect": [
            20,
            280,
            370,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "groove~ cmpe_unassigned 2 @loop 0",
          "outlettype": [
            "signal",
            "signal",
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "mono",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            330,
            70,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "+~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "source_gain",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            180,
            330,
            100,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "sig~ 1.",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "normalized",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            380,
            70,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "dry_envelope",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            300,
            330,
            150,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "line~ 0.",
          "outlettype": [
            "signal",
            "bang"
          ]
        }
      },
      {
        "box": {
          "id": "excitation",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            430,
            70,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "feed",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            460,
            330,
            115,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "sig~ 1.05",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "wet_envelope",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            600,
            330,
            150,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "line~ 0.",
          "outlettype": [
            "signal",
            "bang"
          ]
        }
      },
      {
        "box": {
          "id": "amp_ramp",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            800,
            210,
            110,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "pack f 5.",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "amplitude",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            800,
            250,
            150,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "line~ 0.",
          "outlettype": [
            "signal",
            "bang"
          ]
        }
      },
      {
        "box": {
          "id": "stage_route",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 8,
          "patching_rect": [
            990,
            210,
            290,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "route 1 2 3 4 5 6 7",
          "outlettype": [
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            ""
          ]
        }
      },
      {
        "box": {
          "id": "clear_filters",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1310,
            210,
            90,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "clear",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "stage_values_1",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 4,
          "patching_rect": [
            1050,
            510,
            160,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "unpack f f f f",
          "outlettype": [
            "float",
            "float",
            "float",
            "float"
          ]
        }
      },
      {
        "box": {
          "id": "feed_L1",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            510,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "allpass_L1",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 1,
          "patching_rect": [
            130,
            510,
            230,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "allpass~ 500. 50. 0.98",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "feed_R1",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            510,
            510,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "allpass_R1",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 1,
          "patching_rect": [
            620,
            510,
            230,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "allpass~ 500. 50. 0.98",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "stage_values_2",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 4,
          "patching_rect": [
            1050,
            595,
            160,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "unpack f f f f",
          "outlettype": [
            "float",
            "float",
            "float",
            "float"
          ]
        }
      },
      {
        "box": {
          "id": "feed_L2",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            595,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "allpass_L2",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 1,
          "patching_rect": [
            130,
            595,
            230,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "allpass~ 500. 50. 0.98",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "feed_R2",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            510,
            595,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "allpass_R2",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 1,
          "patching_rect": [
            620,
            595,
            230,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "allpass~ 500. 50. 0.98",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "stage_values_3",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 4,
          "patching_rect": [
            1050,
            680,
            160,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "unpack f f f f",
          "outlettype": [
            "float",
            "float",
            "float",
            "float"
          ]
        }
      },
      {
        "box": {
          "id": "feed_L3",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            680,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "allpass_L3",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 1,
          "patching_rect": [
            130,
            680,
            230,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "allpass~ 500. 50. 0.98",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "feed_R3",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            510,
            680,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "allpass_R3",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 1,
          "patching_rect": [
            620,
            680,
            230,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "allpass~ 500. 50. 0.98",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "stage_values_4",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 4,
          "patching_rect": [
            1050,
            765,
            160,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "unpack f f f f",
          "outlettype": [
            "float",
            "float",
            "float",
            "float"
          ]
        }
      },
      {
        "box": {
          "id": "feed_L4",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            765,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "allpass_L4",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 1,
          "patching_rect": [
            130,
            765,
            230,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "allpass~ 500. 50. 0.98",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "feed_R4",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            510,
            765,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "allpass_R4",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 1,
          "patching_rect": [
            620,
            765,
            230,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "allpass~ 500. 50. 0.98",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "stage_values_5",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 4,
          "patching_rect": [
            1050,
            850,
            160,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "unpack f f f f",
          "outlettype": [
            "float",
            "float",
            "float",
            "float"
          ]
        }
      },
      {
        "box": {
          "id": "feed_L5",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            850,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "allpass_L5",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 1,
          "patching_rect": [
            130,
            850,
            230,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "allpass~ 500. 50. 0.98",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "feed_R5",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            510,
            850,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "allpass_R5",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 1,
          "patching_rect": [
            620,
            850,
            230,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "allpass~ 500. 50. 0.98",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "stage_values_6",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 4,
          "patching_rect": [
            1050,
            935,
            160,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "unpack f f f f",
          "outlettype": [
            "float",
            "float",
            "float",
            "float"
          ]
        }
      },
      {
        "box": {
          "id": "feed_L6",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            935,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "allpass_L6",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 1,
          "patching_rect": [
            130,
            935,
            230,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "allpass~ 500. 50. 0.98",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "feed_R6",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            510,
            935,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "allpass_R6",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 1,
          "patching_rect": [
            620,
            935,
            230,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "allpass~ 500. 50. 0.98",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "stage_values_7",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 4,
          "patching_rect": [
            1050,
            1020,
            160,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "unpack f f f f",
          "outlettype": [
            "float",
            "float",
            "float",
            "float"
          ]
        }
      },
      {
        "box": {
          "id": "feed_L7",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            1020,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "allpass_L7",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 1,
          "patching_rect": [
            130,
            1020,
            230,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "allpass~ 500. 50. 0.98",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "feed_R7",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            510,
            1020,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "allpass_R7",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 1,
          "patching_rect": [
            620,
            1020,
            230,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "allpass~ 500. 50. 0.98",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "this_voice",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            620,
            1560,
            110,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "thispoly~",
          "outlettype": [
            "int",
            "int",
            "int"
          ]
        }
      },
      {
        "box": {
          "id": "initialize",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            620,
            1380,
            110,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "loadbang",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "init_order",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            620,
            1420,
            70,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "t b b",
          "outlettype": [
            "bang",
            "bang"
          ]
        }
      },
      {
        "box": {
          "id": "muted",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            730,
            1480,
            90,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "mute 1",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "available",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            620,
            1480,
            50,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "0",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "run_gate",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            140,
            1660,
            150,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "line~ 0.",
          "outlettype": [
            "signal",
            "bang"
          ]
        }
      },
      {
        "box": {
          "id": "mute_delay",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            320,
            1460,
            110,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "delay 12",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "cancel_mute",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            320,
            1380,
            90,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "stop",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "start_order",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 6,
          "patching_rect": [
            20,
            1380,
            180,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "t f b b b b b",
          "outlettype": [
            "float",
            "bang",
            "bang",
            "bang",
            "bang",
            "bang"
          ]
        }
      },
      {
        "box": {
          "id": "unmute",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            1460,
            90,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "mute 0",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "busy",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            130,
            1460,
            50,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "1",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "gate_on",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            200,
            1460,
            80,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "1. 0.",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "stop_order",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            20,
            1520,
            95,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "t b b b",
          "outlettype": [
            "bang",
            "bang",
            "bang"
          ]
        }
      },
      {
        "box": {
          "id": "gate_off",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            140,
            1560,
            85,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "0. 10.",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "retire_order",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 4,
          "patching_rect": [
            320,
            1520,
            110,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "t b b b b",
          "outlettype": [
            "bang",
            "bang",
            "bang",
            "bang"
          ]
        }
      },
      {
        "box": {
          "id": "player_stop",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            320,
            1600,
            75,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "stop",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "wet_L",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            1130,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "scaled_L",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            130,
            1180,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "gated_L",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            240,
            1230,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "out_L",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            240,
            1290,
            85,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "out~ 1"
        }
      },
      {
        "box": {
          "id": "wet_R",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            510,
            1130,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "scaled_R",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            620,
            1180,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "gated_R",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            730,
            1230,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "out_R",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            730,
            1290,
            85,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "out~ 2"
        }
      },
      {
        "box": {
          "id": "many_note",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            900,
            1380,
            610,
            100
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "Source: Joo Won Park / CMPE. Allpass coefficient = pow(0.001, delaySeconds / decaySeconds). start and stop clear delay memory. Parent fades a reused voice before reconfiguration; explicit targeting owns tail lifetime."
        }
      }
    ],
    "lines": [
      {
        "patchline": {
          "source": [
            "input",
            0
          ],
          "destination": [
            "route",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "route",
            2
          ],
          "destination": [
            "amp_ramp",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "amp_ramp",
            0
          ],
          "destination": [
            "amplitude",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "route",
            0
          ],
          "destination": [
            "buffer_set",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "route",
            1
          ],
          "destination": [
            "rate",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "route",
            3
          ],
          "destination": [
            "source_gain",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "route",
            4
          ],
          "destination": [
            "feed",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "route",
            5
          ],
          "destination": [
            "dry_envelope",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "route",
            6
          ],
          "destination": [
            "wet_envelope",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "route",
            7
          ],
          "destination": [
            "stage_route",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "route",
            8
          ],
          "destination": [
            "clear_filters",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "buffer_set",
            0
          ],
          "destination": [
            "player",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "rate",
            0
          ],
          "destination": [
            "player",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "player",
            0
          ],
          "destination": [
            "mono",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "player",
            1
          ],
          "destination": [
            "mono",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mono",
            0
          ],
          "destination": [
            "normalized",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "source_gain",
            0
          ],
          "destination": [
            "normalized",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "normalized",
            0
          ],
          "destination": [
            "excitation",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "dry_envelope",
            0
          ],
          "destination": [
            "excitation",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_route",
            0
          ],
          "destination": [
            "stage_values_1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "excitation",
            0
          ],
          "destination": [
            "feed_L1",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "feed",
            0
          ],
          "destination": [
            "feed_L1",
            1
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "feed_L1",
            0
          ],
          "destination": [
            "allpass_L1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_1",
            0
          ],
          "destination": [
            "allpass_L1",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_1",
            1
          ],
          "destination": [
            "allpass_L1",
            2
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "clear_filters",
            0
          ],
          "destination": [
            "allpass_L1",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "excitation",
            0
          ],
          "destination": [
            "feed_R1",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "feed",
            0
          ],
          "destination": [
            "feed_R1",
            1
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "feed_R1",
            0
          ],
          "destination": [
            "allpass_R1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_1",
            2
          ],
          "destination": [
            "allpass_R1",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_1",
            3
          ],
          "destination": [
            "allpass_R1",
            2
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "clear_filters",
            0
          ],
          "destination": [
            "allpass_R1",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "stage_route",
            1
          ],
          "destination": [
            "stage_values_2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "allpass_L1",
            0
          ],
          "destination": [
            "feed_L2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "feed",
            0
          ],
          "destination": [
            "feed_L2",
            1
          ],
          "order": 2
        }
      },
      {
        "patchline": {
          "source": [
            "feed_L2",
            0
          ],
          "destination": [
            "allpass_L2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_2",
            0
          ],
          "destination": [
            "allpass_L2",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_2",
            1
          ],
          "destination": [
            "allpass_L2",
            2
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "clear_filters",
            0
          ],
          "destination": [
            "allpass_L2",
            0
          ],
          "order": 2
        }
      },
      {
        "patchline": {
          "source": [
            "allpass_R1",
            0
          ],
          "destination": [
            "feed_R2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "feed",
            0
          ],
          "destination": [
            "feed_R2",
            1
          ],
          "order": 3
        }
      },
      {
        "patchline": {
          "source": [
            "feed_R2",
            0
          ],
          "destination": [
            "allpass_R2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_2",
            2
          ],
          "destination": [
            "allpass_R2",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_2",
            3
          ],
          "destination": [
            "allpass_R2",
            2
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "clear_filters",
            0
          ],
          "destination": [
            "allpass_R2",
            0
          ],
          "order": 3
        }
      },
      {
        "patchline": {
          "source": [
            "stage_route",
            2
          ],
          "destination": [
            "stage_values_3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "allpass_L2",
            0
          ],
          "destination": [
            "feed_L3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "feed",
            0
          ],
          "destination": [
            "feed_L3",
            1
          ],
          "order": 4
        }
      },
      {
        "patchline": {
          "source": [
            "feed_L3",
            0
          ],
          "destination": [
            "allpass_L3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_3",
            0
          ],
          "destination": [
            "allpass_L3",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_3",
            1
          ],
          "destination": [
            "allpass_L3",
            2
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "clear_filters",
            0
          ],
          "destination": [
            "allpass_L3",
            0
          ],
          "order": 4
        }
      },
      {
        "patchline": {
          "source": [
            "allpass_R2",
            0
          ],
          "destination": [
            "feed_R3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "feed",
            0
          ],
          "destination": [
            "feed_R3",
            1
          ],
          "order": 5
        }
      },
      {
        "patchline": {
          "source": [
            "feed_R3",
            0
          ],
          "destination": [
            "allpass_R3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_3",
            2
          ],
          "destination": [
            "allpass_R3",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_3",
            3
          ],
          "destination": [
            "allpass_R3",
            2
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "clear_filters",
            0
          ],
          "destination": [
            "allpass_R3",
            0
          ],
          "order": 5
        }
      },
      {
        "patchline": {
          "source": [
            "stage_route",
            3
          ],
          "destination": [
            "stage_values_4",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "allpass_L3",
            0
          ],
          "destination": [
            "feed_L4",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "feed",
            0
          ],
          "destination": [
            "feed_L4",
            1
          ],
          "order": 6
        }
      },
      {
        "patchline": {
          "source": [
            "feed_L4",
            0
          ],
          "destination": [
            "allpass_L4",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_4",
            0
          ],
          "destination": [
            "allpass_L4",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_4",
            1
          ],
          "destination": [
            "allpass_L4",
            2
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "clear_filters",
            0
          ],
          "destination": [
            "allpass_L4",
            0
          ],
          "order": 6
        }
      },
      {
        "patchline": {
          "source": [
            "allpass_R3",
            0
          ],
          "destination": [
            "feed_R4",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "feed",
            0
          ],
          "destination": [
            "feed_R4",
            1
          ],
          "order": 7
        }
      },
      {
        "patchline": {
          "source": [
            "feed_R4",
            0
          ],
          "destination": [
            "allpass_R4",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_4",
            2
          ],
          "destination": [
            "allpass_R4",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_4",
            3
          ],
          "destination": [
            "allpass_R4",
            2
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "clear_filters",
            0
          ],
          "destination": [
            "allpass_R4",
            0
          ],
          "order": 7
        }
      },
      {
        "patchline": {
          "source": [
            "stage_route",
            4
          ],
          "destination": [
            "stage_values_5",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "allpass_L4",
            0
          ],
          "destination": [
            "feed_L5",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "feed",
            0
          ],
          "destination": [
            "feed_L5",
            1
          ],
          "order": 8
        }
      },
      {
        "patchline": {
          "source": [
            "feed_L5",
            0
          ],
          "destination": [
            "allpass_L5",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_5",
            0
          ],
          "destination": [
            "allpass_L5",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_5",
            1
          ],
          "destination": [
            "allpass_L5",
            2
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "clear_filters",
            0
          ],
          "destination": [
            "allpass_L5",
            0
          ],
          "order": 8
        }
      },
      {
        "patchline": {
          "source": [
            "allpass_R4",
            0
          ],
          "destination": [
            "feed_R5",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "feed",
            0
          ],
          "destination": [
            "feed_R5",
            1
          ],
          "order": 9
        }
      },
      {
        "patchline": {
          "source": [
            "feed_R5",
            0
          ],
          "destination": [
            "allpass_R5",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_5",
            2
          ],
          "destination": [
            "allpass_R5",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_5",
            3
          ],
          "destination": [
            "allpass_R5",
            2
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "clear_filters",
            0
          ],
          "destination": [
            "allpass_R5",
            0
          ],
          "order": 9
        }
      },
      {
        "patchline": {
          "source": [
            "stage_route",
            5
          ],
          "destination": [
            "stage_values_6",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "allpass_L5",
            0
          ],
          "destination": [
            "feed_L6",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "feed",
            0
          ],
          "destination": [
            "feed_L6",
            1
          ],
          "order": 10
        }
      },
      {
        "patchline": {
          "source": [
            "feed_L6",
            0
          ],
          "destination": [
            "allpass_L6",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_6",
            0
          ],
          "destination": [
            "allpass_L6",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_6",
            1
          ],
          "destination": [
            "allpass_L6",
            2
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "clear_filters",
            0
          ],
          "destination": [
            "allpass_L6",
            0
          ],
          "order": 10
        }
      },
      {
        "patchline": {
          "source": [
            "allpass_R5",
            0
          ],
          "destination": [
            "feed_R6",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "feed",
            0
          ],
          "destination": [
            "feed_R6",
            1
          ],
          "order": 11
        }
      },
      {
        "patchline": {
          "source": [
            "feed_R6",
            0
          ],
          "destination": [
            "allpass_R6",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_6",
            2
          ],
          "destination": [
            "allpass_R6",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_6",
            3
          ],
          "destination": [
            "allpass_R6",
            2
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "clear_filters",
            0
          ],
          "destination": [
            "allpass_R6",
            0
          ],
          "order": 11
        }
      },
      {
        "patchline": {
          "source": [
            "stage_route",
            6
          ],
          "destination": [
            "stage_values_7",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "allpass_L6",
            0
          ],
          "destination": [
            "feed_L7",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "feed",
            0
          ],
          "destination": [
            "feed_L7",
            1
          ],
          "order": 12
        }
      },
      {
        "patchline": {
          "source": [
            "feed_L7",
            0
          ],
          "destination": [
            "allpass_L7",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_7",
            0
          ],
          "destination": [
            "allpass_L7",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_7",
            1
          ],
          "destination": [
            "allpass_L7",
            2
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "clear_filters",
            0
          ],
          "destination": [
            "allpass_L7",
            0
          ],
          "order": 12
        }
      },
      {
        "patchline": {
          "source": [
            "allpass_R6",
            0
          ],
          "destination": [
            "feed_R7",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "feed",
            0
          ],
          "destination": [
            "feed_R7",
            1
          ],
          "order": 13
        }
      },
      {
        "patchline": {
          "source": [
            "feed_R7",
            0
          ],
          "destination": [
            "allpass_R7",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_7",
            2
          ],
          "destination": [
            "allpass_R7",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stage_values_7",
            3
          ],
          "destination": [
            "allpass_R7",
            2
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "clear_filters",
            0
          ],
          "destination": [
            "allpass_R7",
            0
          ],
          "order": 13
        }
      },
      {
        "patchline": {
          "source": [
            "initialize",
            0
          ],
          "destination": [
            "init_order",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "init_order",
            1
          ],
          "destination": [
            "available",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "init_order",
            0
          ],
          "destination": [
            "muted",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "muted",
            0
          ],
          "destination": [
            "this_voice",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "available",
            0
          ],
          "destination": [
            "this_voice",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "cancel_mute",
            0
          ],
          "destination": [
            "mute_delay",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "route",
            9
          ],
          "destination": [
            "start_order",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "start_order",
            5
          ],
          "destination": [
            "cancel_mute",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "start_order",
            4
          ],
          "destination": [
            "clear_filters",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "start_order",
            3
          ],
          "destination": [
            "unmute",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "start_order",
            2
          ],
          "destination": [
            "busy",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "start_order",
            1
          ],
          "destination": [
            "gate_on",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "unmute",
            0
          ],
          "destination": [
            "this_voice",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "busy",
            0
          ],
          "destination": [
            "this_voice",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "gate_on",
            0
          ],
          "destination": [
            "run_gate",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "start_order",
            0
          ],
          "destination": [
            "player",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "route",
            10
          ],
          "destination": [
            "stop_order",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "route",
            11
          ],
          "destination": [
            "stop_order",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stop_order",
            2
          ],
          "destination": [
            "cancel_mute",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stop_order",
            1
          ],
          "destination": [
            "gate_off",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stop_order",
            0
          ],
          "destination": [
            "mute_delay",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "gate_off",
            0
          ],
          "destination": [
            "run_gate",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mute_delay",
            0
          ],
          "destination": [
            "retire_order",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "retire_order",
            3
          ],
          "destination": [
            "player_stop",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "player_stop",
            0
          ],
          "destination": [
            "player",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "retire_order",
            2
          ],
          "destination": [
            "clear_filters",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "retire_order",
            1
          ],
          "destination": [
            "available",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "retire_order",
            0
          ],
          "destination": [
            "muted",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "allpass_L7",
            0
          ],
          "destination": [
            "wet_L",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "wet_envelope",
            0
          ],
          "destination": [
            "wet_L",
            1
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "wet_L",
            0
          ],
          "destination": [
            "scaled_L",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "amplitude",
            0
          ],
          "destination": [
            "scaled_L",
            1
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "scaled_L",
            0
          ],
          "destination": [
            "gated_L",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "run_gate",
            0
          ],
          "destination": [
            "gated_L",
            1
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "gated_L",
            0
          ],
          "destination": [
            "out_L",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "allpass_R7",
            0
          ],
          "destination": [
            "wet_R",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "wet_envelope",
            0
          ],
          "destination": [
            "wet_R",
            1
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "wet_R",
            0
          ],
          "destination": [
            "scaled_R",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "amplitude",
            0
          ],
          "destination": [
            "scaled_R",
            1
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "scaled_R",
            0
          ],
          "destination": [
            "gated_R",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "run_gate",
            0
          ],
          "destination": [
            "gated_R",
            1
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "gated_R",
            0
          ],
          "destination": [
            "out_R",
            0
          ]
        }
      }
    ],
    "autosave": 0
  }
}
