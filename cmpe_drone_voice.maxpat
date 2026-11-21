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
      1500,
      1310
    ],
    "default_fontsize": 13.0,
    "default_fontname": "Arial",
    "title": "cmpe_drone_voice",
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
            1460,
            76
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "RMHS native drone voice. Messages: freq Hz; drift targetHz durationMs; mod Hz; modphase 0..1 (cycle phase); amp gain; pan -1..1; env target/ms pairs; start; stop; panic.\nCarrier = sine(freq + drift). Amplitude = amp * (1 + 0.5*cos(modPhase)). Original musical process: Joo Won Park / joowonpark.net/cmpe."
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
          "numoutlets": 11,
          "patching_rect": [
            20,
            150,
            1460,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "route freq drift mod modphase amp pan env start stop panic",
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
            ""
          ]
        }
      },
      {
        "box": {
          "id": "frequency",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            20,
            230,
            130,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "sig~ 110.",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "drift",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            200,
            230,
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
          "id": "frequency_sum",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            300,
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
          "id": "carrier",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            360,
            130,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "cycle~ 110.",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "carrier_reset",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            180,
            360,
            120,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "reset 0.75",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "modulator",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            400,
            230,
            130,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "cycle~ 0.01",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "mod_phase",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            570,
            230,
            150,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "prepend reset",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "mod_depth",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            400,
            300,
            100,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "*~ 0.5",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "mod_bias",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            400,
            360,
            100,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "+~ 1.",
          "outlettype": [
            "signal"
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
            570,
            300,
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
            570,
            340,
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
          "id": "envelope",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            570,
            420,
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
          "id": "pan_clip",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 1,
          "patching_rect": [
            770,
            230,
            110,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "clip -1. 1.",
          "outlettype": [
            ""
          ]
        }
      },
      {
        "box": {
          "id": "pan_left_value",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            770,
            270,
            330,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "expr cos(($f1+1.)*0.7853981633974483)",
          "outlettype": [
            "float"
          ]
        }
      },
      {
        "box": {
          "id": "pan_right_value",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1130,
            270,
            330,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "expr sin(($f1+1.)*0.7853981633974483)",
          "outlettype": [
            "float"
          ]
        }
      },
      {
        "box": {
          "id": "pan_left_ramp",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            770,
            310,
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
          "id": "pan_right_ramp",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1130,
            310,
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
          "id": "pan_left",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            770,
            350,
            150,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "line~ 0.7071067811865476",
          "outlettype": [
            "signal",
            "bang"
          ]
        }
      },
      {
        "box": {
          "id": "pan_right",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            1130,
            350,
            150,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "line~ 0.7071067811865476",
          "outlettype": [
            "signal",
            "bang"
          ]
        }
      },
      {
        "box": {
          "id": "modulated",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            450,
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
          "id": "scaled",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            510,
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
          "id": "shaped",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            570,
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
          "id": "gated",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            630,
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
          "id": "this_voice",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            620,
            1070,
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
            890,
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
            930,
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
            990,
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
            990,
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
            1170,
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
            970,
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
            890,
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
            890,
            180,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "t b b b b b b",
          "outlettype": [
            "bang",
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
            970,
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
            970,
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
            970,
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
            1030,
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
            1070,
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
            1030,
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
          "id": "panned_left",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            700,
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
          "id": "out_left",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            20,
            770,
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
          "id": "panned_right",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            280,
            700,
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
          "id": "out_right",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            280,
            770,
            85,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "out~ 2"
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
            4
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
            5
          ],
          "destination": [
            "pan_clip",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "pan_clip",
            0
          ],
          "destination": [
            "pan_left_value",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "pan_left_value",
            0
          ],
          "destination": [
            "pan_left_ramp",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "pan_left_ramp",
            0
          ],
          "destination": [
            "pan_left",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "pan_clip",
            0
          ],
          "destination": [
            "pan_right_value",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "pan_right_value",
            0
          ],
          "destination": [
            "pan_right_ramp",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "pan_right_ramp",
            0
          ],
          "destination": [
            "pan_right",
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
            "frequency",
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
            "drift",
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
            "modulator",
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
            "mod_phase",
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
            "envelope",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "frequency",
            0
          ],
          "destination": [
            "frequency_sum",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "drift",
            0
          ],
          "destination": [
            "frequency_sum",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "frequency_sum",
            0
          ],
          "destination": [
            "carrier",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "carrier_reset",
            0
          ],
          "destination": [
            "carrier",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mod_phase",
            0
          ],
          "destination": [
            "modulator",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "modulator",
            0
          ],
          "destination": [
            "mod_depth",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mod_depth",
            0
          ],
          "destination": [
            "mod_bias",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "carrier",
            0
          ],
          "destination": [
            "modulated",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mod_bias",
            0
          ],
          "destination": [
            "modulated",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "modulated",
            0
          ],
          "destination": [
            "scaled",
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
            "scaled",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "scaled",
            0
          ],
          "destination": [
            "shaped",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "envelope",
            0
          ],
          "destination": [
            "shaped",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "shaped",
            0
          ],
          "destination": [
            "gated",
            0
          ]
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
            7
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
            "carrier_reset",
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
            "stop_order",
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
            "run_gate",
            0
          ],
          "destination": [
            "gated",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "gated",
            0
          ],
          "destination": [
            "panned_left",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "pan_left",
            0
          ],
          "destination": [
            "panned_left",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "panned_left",
            0
          ],
          "destination": [
            "out_left",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "gated",
            0
          ],
          "destination": [
            "panned_right",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "pan_right",
            0
          ],
          "destination": [
            "panned_right",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "panned_right",
            0
          ],
          "destination": [
            "out_right",
            0
          ]
        }
      }
    ],
    "autosave": 0
  }
}
