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
      1250
    ],
    "default_fontsize": 13.0,
    "default_fontname": "Arial",
    "title": "cmpe_sample_voice",
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
          "text": "ISJS native sample voice. Messages: set buffer; rate ratio; amp gain; pan -1..1; env target/ms pairs; start positionMs; stop; panic.\nBoth source channels are summed before equal-power panning. Original musical process: Joo Won Park / joowonpark.net/cmpe."
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
          "numoutlets": 9,
          "patching_rect": [
            20,
            150,
            1460,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "route set rate amp pan env start stop panic",
          "outlettype": [
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
            220,
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
            220,
            95,
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
            300,
            450,
            24
          ],
          "fontname": "Arial",
          "fontsize": 13.0,
          "text": "groove~ cmpe_unassigned 2 @loop 1 @loopinterp 1",
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
            360,
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
          "id": "envelope",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            360,
            360,
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
            530,
            220,
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
            530,
            260,
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
            220,
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
            260,
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
            260,
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
          "id": "pan_right_ramp",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1130,
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
          "id": "pan_left",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            770,
            340,
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
            340,
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
          "id": "shaped",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            440,
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
            500,
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
            560,
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
            990,
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
            810,
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
            850,
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
            910,
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
            910,
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
            1090,
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
            890,
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
            810,
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
            810,
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
            890,
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
            890,
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
            890,
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
            950,
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
            990,
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
            950,
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
            1030,
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
          "id": "panned_left",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            20,
            640,
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
            710,
            80,
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
            640,
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
            710,
            80,
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
            3
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
            "buffer_set",
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
            "route",
            4
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
            5
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
            "player",
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
            "stop_order",
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
