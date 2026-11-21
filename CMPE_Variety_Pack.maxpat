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
      840,
      866
    ],
    "openinpresentation": 1,
    "default_fontsize": 17.0,
    "default_fontface": 0,
    "default_fontname": "Arial",
    "bgcolor": [
      1.0,
      1.0,
      1.0,
      1.0
    ],
    "bglockedcolor": [
      1.0,
      1.0,
      1.0,
      1.0
    ],
    "title": "CMPE Variety Pack / APG \u00b7 ISJS \u00b7 Many \u00b7 RMHS \u00b7 SIOE",
    "boxes": [
      {
        "box": {
          "id": "title",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            13,
            480,
            39
          ],
          "fontname": "Arial",
          "fontsize": 30.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "CMPE Variety Pack",
          "presentation": 1,
          "presentation_rect": [
            24,
            13,
            480,
            39
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "fontface": 1,
          "varname": "title"
        }
      },
      {
        "box": {
          "id": "subtitle",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            26,
            54,
            475,
            25
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Computer Music Practice Examples",
          "presentation": 1,
          "presentation_rect": [
            26,
            54,
            475,
            25
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "varname": "subtitle"
        }
      },
      {
        "box": {
          "id": "demo_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            522,
            18,
            124,
            30
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "DEMO",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            522,
            18,
            124,
            30
          ],
          "varname": "demo_button",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 3.0,
          "bgcolor": [
            0.92,
            0.92,
            0.92,
            1.0
          ],
          "bgoncolor": [
            0.76,
            0.76,
            0.76,
            1.0
          ],
          "textoncolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "textovercolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Load the three included demo sounds."
        }
      },
      {
        "box": {
          "id": "test_audio",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            660,
            18,
            156,
            30
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "TEST SOUND",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            660,
            18,
            156,
            30
          ],
          "varname": "test_audio",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 3.0,
          "bgcolor": [
            0.92,
            0.92,
            0.92,
            1.0
          ],
          "bgoncolor": [
            0.76,
            0.76,
            0.76,
            1.0
          ],
          "textoncolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "textovercolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Play a short independent tone through the selected audio output."
        }
      },
      {
        "box": {
          "id": "header_rule",
          "maxclass": "panel",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            85,
            792,
            1
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "presentation": 0,
          "presentation_rect": [
            24,
            85,
            792,
            1
          ],
          "bgcolor": [
            0.81,
            0.81,
            0.81,
            1.0
          ],
          "border": 0,
          "rounded": 0,
          "ignoreclick": 1,
          "hidden": 1
        }
      },
      {
        "box": {
          "id": "output_rule",
          "maxclass": "panel",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            280,
            792,
            1
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "presentation": 0,
          "presentation_rect": [
            24,
            280,
            792,
            1
          ],
          "bgcolor": [
            0.81,
            0.81,
            0.81,
            1.0
          ],
          "border": 0,
          "rounded": 0,
          "ignoreclick": 1,
          "hidden": 1
        }
      },
      {
        "box": {
          "id": "credit_rule",
          "maxclass": "panel",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            815,
            792,
            1
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "presentation": 1,
          "presentation_rect": [
            24,
            815,
            792,
            1
          ],
          "bgcolor": [
            0.81,
            0.81,
            0.81,
            1.0
          ],
          "border": 0,
          "rounded": 0,
          "ignoreclick": 1,
          "varname": "credit_rule"
        }
      },
      {
        "box": {
          "id": "source_label1",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            173,
            116,
            26
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "SAMPLE 1",
          "presentation": 1,
          "presentation_rect": [
            24,
            173,
            116,
            26
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "fontface": 1,
          "varname": "source_label1",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "load1",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            158,
            169,
            114,
            34
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "LOAD",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            158,
            169,
            114,
            34
          ],
          "varname": "load1",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 3.0,
          "bgcolor": [
            0.92,
            0.92,
            0.92,
            1.0
          ],
          "bgoncolor": [
            0.76,
            0.76,
            0.76,
            1.0
          ],
          "textoncolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "textovercolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose a mono or stereo WAV/AIFF for sample 1.",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "file1",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            211,
            248,
            42
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Loading demo sound...",
          "presentation": 1,
          "presentation_rect": [
            24,
            211,
            248,
            42
          ],
          "varname": "file1",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "linecount": 2,
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "repeat_label1",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            258,
            248,
            23
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Sample 1 repeats",
          "presentation": 1,
          "presentation_rect": [
            24,
            258,
            248,
            23
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "varname": "repeat_label1",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "repeat1",
          "maxclass": "number",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            24,
            284,
            248,
            30
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "presentation": 1,
          "presentation_rect": [
            24,
            284,
            248,
            30
          ],
          "varname": "repeat1",
          "bgcolor": [
            0.95,
            0.95,
            0.95,
            1.0
          ],
          "bgoncolor": [
            0.84,
            0.84,
            0.84,
            1.0
          ],
          "hbgcolor": [
            0.15,
            0.15,
            0.15,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "triangle": 0,
          "parameter_enable": 0,
          "minimum": 1,
          "maximum": 20,
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "source_label2",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            296,
            173,
            116,
            26
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "SAMPLE 2",
          "presentation": 1,
          "presentation_rect": [
            296,
            173,
            116,
            26
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "fontface": 1,
          "varname": "source_label2",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "load2",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            430,
            169,
            114,
            34
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "LOAD",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            430,
            169,
            114,
            34
          ],
          "varname": "load2",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 3.0,
          "bgcolor": [
            0.92,
            0.92,
            0.92,
            1.0
          ],
          "bgoncolor": [
            0.76,
            0.76,
            0.76,
            1.0
          ],
          "textoncolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "textovercolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose a mono or stereo WAV/AIFF for sample 2.",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "file2",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            296,
            211,
            248,
            42
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Loading demo sound...",
          "presentation": 1,
          "presentation_rect": [
            296,
            211,
            248,
            42
          ],
          "varname": "file2",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "linecount": 2,
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "repeat_label2",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            296,
            258,
            248,
            23
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Sample 2 repeats",
          "presentation": 1,
          "presentation_rect": [
            296,
            258,
            248,
            23
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "varname": "repeat_label2",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "repeat2",
          "maxclass": "number",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            296,
            284,
            248,
            30
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "presentation": 1,
          "presentation_rect": [
            296,
            284,
            248,
            30
          ],
          "varname": "repeat2",
          "bgcolor": [
            0.95,
            0.95,
            0.95,
            1.0
          ],
          "bgoncolor": [
            0.84,
            0.84,
            0.84,
            1.0
          ],
          "hbgcolor": [
            0.15,
            0.15,
            0.15,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "triangle": 0,
          "parameter_enable": 0,
          "minimum": 1,
          "maximum": 20,
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "source_label3",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            568,
            173,
            116,
            26
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "SAMPLE 3",
          "presentation": 1,
          "presentation_rect": [
            568,
            173,
            116,
            26
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "fontface": 1,
          "varname": "source_label3",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "load3",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            702,
            169,
            114,
            34
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "LOAD",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            702,
            169,
            114,
            34
          ],
          "varname": "load3",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 3.0,
          "bgcolor": [
            0.92,
            0.92,
            0.92,
            1.0
          ],
          "bgoncolor": [
            0.76,
            0.76,
            0.76,
            1.0
          ],
          "textoncolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "textovercolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose a mono or stereo WAV/AIFF for sample 3.",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "file3",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            568,
            211,
            248,
            42
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Loading demo sound...",
          "presentation": 1,
          "presentation_rect": [
            568,
            211,
            248,
            42
          ],
          "varname": "file3",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "linecount": 2,
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "repeat_label3",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            568,
            258,
            248,
            23
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Sample 3 repeats",
          "presentation": 1,
          "presentation_rect": [
            568,
            258,
            248,
            23
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "varname": "repeat_label3",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "repeat3",
          "maxclass": "number",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            568,
            284,
            248,
            30
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "presentation": 1,
          "presentation_rect": [
            568,
            284,
            248,
            30
          ],
          "varname": "repeat3",
          "bgcolor": [
            0.95,
            0.95,
            0.95,
            1.0
          ],
          "bgoncolor": [
            0.84,
            0.84,
            0.84,
            1.0
          ],
          "hbgcolor": [
            0.15,
            0.15,
            0.15,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "triangle": 0,
          "parameter_enable": 0,
          "minimum": 1,
          "maximum": 20,
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "pitch_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            322,
            248,
            23
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Pitch range",
          "presentation": 1,
          "presentation_rect": [
            24,
            322,
            248,
            23
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "varname": "pitch_label",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "pitch",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            24,
            348,
            248,
            30
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "presentation": 1,
          "presentation_rect": [
            24,
            348,
            248,
            30
          ],
          "varname": "pitch",
          "bgcolor": [
            0.95,
            0.95,
            0.95,
            1.0
          ],
          "bgoncolor": [
            0.84,
            0.84,
            0.84,
            1.0
          ],
          "hbgcolor": [
            0.15,
            0.15,
            0.15,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "triangle": 0,
          "parameter_enable": 0,
          "minimum": 0.0,
          "maximum": 1.0,
          "format": 6,
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "monitor_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            540,
            386,
            92,
            25
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Vol (dB)",
          "presentation": 1,
          "presentation_rect": [
            540,
            386,
            92,
            25
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "varname": "monitor_label"
        }
      },
      {
        "box": {
          "id": "monitor_level",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            634,
            382,
            96,
            30
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "presentation": 1,
          "presentation_rect": [
            634,
            382,
            96,
            30
          ],
          "varname": "monitor_level",
          "bgcolor": [
            0.95,
            0.95,
            0.95,
            1.0
          ],
          "bgoncolor": [
            0.84,
            0.84,
            0.84,
            1.0
          ],
          "hbgcolor": [
            0.15,
            0.15,
            0.15,
            1.0
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "triangle": 0,
          "parameter_enable": 0,
          "minimum": -60.0,
          "maximum": 0.0,
          "format": 6
        }
      },
      {
        "box": {
          "id": "meter_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            568,
            242,
            96,
            26
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "LEVEL",
          "presentation": 0,
          "presentation_rect": [
            568,
            242,
            96,
            26
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "hidden": 1
        }
      },
      {
        "box": {
          "id": "meter_L",
          "maxclass": "meter~",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            752,
            382,
            64,
            12
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "outlettype": [
            "float"
          ],
          "presentation": 1,
          "presentation_rect": [
            752,
            382,
            64,
            12
          ],
          "bgcolor": [
            0.17,
            0.17,
            0.17,
            1.0
          ],
          "offcolor": [
            0.28,
            0.28,
            0.28,
            1.0
          ],
          "oncolor": [
            0.18,
            0.78,
            0.26,
            1.0
          ],
          "monotone": 1,
          "orientation": 1,
          "varname": "meter_L"
        }
      },
      {
        "box": {
          "id": "meter_R",
          "maxclass": "meter~",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            752,
            400,
            64,
            12
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "outlettype": [
            "float"
          ],
          "presentation": 1,
          "presentation_rect": [
            752,
            400,
            64,
            12
          ],
          "bgcolor": [
            0.17,
            0.17,
            0.17,
            1.0
          ],
          "offcolor": [
            0.28,
            0.28,
            0.28,
            1.0
          ],
          "oncolor": [
            0.18,
            0.78,
            0.26,
            1.0
          ],
          "monotone": 1,
          "orientation": 1,
          "varname": "meter_R"
        }
      },
      {
        "box": {
          "id": "output_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            386,
            220,
            25
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "OUTPUT",
          "presentation": 1,
          "presentation_rect": [
            24,
            386,
            220,
            25
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "fontface": 1,
          "varname": "output_label"
        }
      },
      {
        "box": {
          "id": "duration",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            260,
            386,
            242,
            25
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Length: --",
          "presentation": 1,
          "presentation_rect": [
            260,
            386,
            242,
            25
          ],
          "varname": "duration",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "time",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            620,
            562,
            196,
            27
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "0.0 s",
          "presentation": 1,
          "presentation_rect": [
            620,
            562,
            196,
            27
          ],
          "varname": "time",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "textjustification": 2
        }
      },
      {
        "box": {
          "id": "channel_l",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            436,
            28,
            25
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "L",
          "presentation": 1,
          "presentation_rect": [
            24,
            436,
            28,
            25
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "fontface": 1,
          "varname": "channel_l",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "wave_l",
          "maxclass": "waveform~",
          "numinlets": 5,
          "numoutlets": 6,
          "patching_rect": [
            56,
            416,
            760,
            66
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "outlettype": [
            "float",
            "float",
            "float",
            "float",
            "list",
            "list"
          ],
          "presentation": 1,
          "presentation_rect": [
            56,
            416,
            760,
            66
          ],
          "varname": "wave_l",
          "buffername": "apgw_out_init",
          "chanoffset": 1,
          "allowdrag": 0,
          "setmode": 1,
          "setunit": 0,
          "labels": 1,
          "quiet": 0,
          "outmode": 4,
          "bgcolor": [
            0.96,
            0.96,
            0.96,
            1.0
          ],
          "waveformcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "gridcolor": [
            0.65,
            0.65,
            0.65,
            1.0
          ],
          "selectioncolor": [
            0.15,
            0.43,
            0.85,
            0.26
          ],
          "vzoom": 1.0,
          "voffset": 0.0,
          "hint": "Drag across the waveform to choose a playback or loop range.",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "channel_r",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            508,
            28,
            25
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "R",
          "presentation": 1,
          "presentation_rect": [
            24,
            508,
            28,
            25
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "fontface": 1,
          "varname": "channel_r",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "wave_r",
          "maxclass": "waveform~",
          "numinlets": 5,
          "numoutlets": 6,
          "patching_rect": [
            56,
            488,
            760,
            66
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "outlettype": [
            "float",
            "float",
            "float",
            "float",
            "list",
            "list"
          ],
          "presentation": 1,
          "presentation_rect": [
            56,
            488,
            760,
            66
          ],
          "varname": "wave_r",
          "buffername": "apgw_out_init",
          "chanoffset": 2,
          "allowdrag": 0,
          "setmode": 1,
          "setunit": 0,
          "labels": 1,
          "quiet": 0,
          "outmode": 4,
          "bgcolor": [
            0.96,
            0.96,
            0.96,
            1.0
          ],
          "waveformcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "gridcolor": [
            0.65,
            0.65,
            0.65,
            1.0
          ],
          "selectioncolor": [
            0.15,
            0.43,
            0.85,
            0.26
          ],
          "vzoom": 1.0,
          "voffset": 0.0,
          "hint": "Drag across the waveform to choose a playback or loop range.",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "selection_info",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            562,
            580,
            27
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Drag across the waveform to select a range.",
          "presentation": 1,
          "presentation_rect": [
            24,
            562,
            580,
            27
          ],
          "varname": "selection_info",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "loop_toggle",
          "maxclass": "toggle",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            24,
            607,
            26,
            26
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "outlettype": [
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            24,
            607,
            26,
            26
          ],
          "varname": "loop_toggle",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "checkedcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "uncheckedcolor": [
            0.18,
            0.18,
            0.18,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Repeat the selected range. Turn off to play it once.",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "loop_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            62,
            606,
            320,
            28
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Loop selected range",
          "presentation": 1,
          "presentation_rect": [
            62,
            606,
            320,
            28
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "varname": "loop_label",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "clear_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            424,
            602,
            182,
            34
          ],
          "fontname": "Arial",
          "fontsize": 18.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "FULL RANGE",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            424,
            602,
            182,
            34
          ],
          "varname": "clear_button",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 3.0,
          "bgcolor": [
            0.92,
            0.92,
            0.92,
            1.0
          ],
          "bgoncolor": [
            0.76,
            0.76,
            0.76,
            1.0
          ],
          "textoncolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "textovercolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Reset the selected range to the entire rendered piece.",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "save_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            624,
            602,
            192,
            34
          ],
          "fontname": "Arial",
          "fontsize": 18.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "SAVE WAV",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            624,
            602,
            192,
            34
          ],
          "varname": "save_button",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 3.0,
          "bgcolor": [
            0.92,
            0.92,
            0.92,
            1.0
          ],
          "bgoncolor": [
            0.76,
            0.76,
            0.76,
            1.0
          ],
          "textoncolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "textovercolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Save the complete rendered piece as a WAV file.",
          "hidden": 0
        }
      },
      {
        "box": {
          "id": "play_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            24,
            650,
            380,
            52
          ],
          "fontname": "Arial",
          "fontsize": 26.0,
          "textcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "text": "PLAY",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            24,
            650,
            380,
            52
          ],
          "varname": "play_button",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 3.0,
          "bgcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "bgoncolor": [
            0.24,
            0.24,
            0.24,
            1.0
          ],
          "textoncolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "textovercolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "parameter_enable": 0,
          "fontface": 1,
          "hint": "Start the selected instrument or play its rendered result."
        }
      },
      {
        "box": {
          "id": "stop_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            420,
            650,
            190,
            52
          ],
          "fontname": "Arial",
          "fontsize": 24.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "STOP",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            420,
            650,
            190,
            52
          ],
          "varname": "stop_button",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 3.0,
          "bgcolor": [
            0.92,
            0.92,
            0.92,
            1.0
          ],
          "bgoncolor": [
            0.76,
            0.76,
            0.76,
            1.0
          ],
          "textoncolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "textovercolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "parameter_enable": 0,
          "active": 1,
          "hint": "Stop audio or cancel preparation."
        }
      },
      {
        "box": {
          "id": "new_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            626,
            650,
            190,
            52
          ],
          "fontname": "Arial",
          "fontsize": 24.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "NEW",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            626,
            650,
            190,
            52
          ],
          "varname": "new_button",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 3.0,
          "bgcolor": [
            0.92,
            0.92,
            0.92,
            1.0
          ],
          "bgoncolor": [
            0.76,
            0.76,
            0.76,
            1.0
          ],
          "textoncolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "textovercolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Start a fresh result for the selected instrument."
        }
      },
      {
        "box": {
          "id": "progress",
          "maxclass": "slider",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            24,
            714,
            792,
            8
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "outlettype": [
            ""
          ],
          "presentation": 1,
          "presentation_rect": [
            24,
            714,
            792,
            8
          ],
          "varname": "progress",
          "floatoutput": 1,
          "size": 1.0,
          "min": 0.0,
          "mult": 1.0,
          "inputrangemode": 1,
          "orientation": 1,
          "ignoreclick": 1,
          "parameter_enable": 0,
          "bgcolor": [
            0.84,
            0.84,
            0.84,
            1.0
          ],
          "elementcolor": [
            0.84,
            0.84,
            0.84,
            1.0
          ],
          "knobcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "knobshape": 0
        }
      },
      {
        "box": {
          "id": "render_info",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            728,
            792,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Starting...",
          "presentation": 1,
          "presentation_rect": [
            24,
            728,
            792,
            24
          ],
          "varname": "render_info",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "status",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            760,
            792,
            44
          ],
          "fontname": "Arial",
          "fontsize": 18.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Loading the audio controller...",
          "presentation": 1,
          "presentation_rect": [
            24,
            760,
            792,
            44
          ],
          "varname": "status",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "linecount": 2
        }
      },
      {
        "box": {
          "id": "original_credit",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            832,
            498,
            26
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Original CMPE by Joo Won Park",
          "presentation": 1,
          "presentation_rect": [
            24,
            832,
            498,
            26
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "varname": "original_credit"
        }
      },
      {
        "box": {
          "id": "original_link",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            548,
            827,
            268,
            32
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "joowonpark.net/cmpe",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            548,
            827,
            268,
            32
          ],
          "varname": "original_link",
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 3.0,
          "bgcolor": [
            0.92,
            0.92,
            0.92,
            1.0
          ],
          "bgoncolor": [
            0.76,
            0.76,
            0.76,
            1.0
          ],
          "textoncolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "textovercolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Open Joo Won Park's original Computer Music Practice Examples."
        }
      },
      {
        "box": {
          "id": "original_url",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1320,
            600,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "; max launchbrowser https://joowonpark.net/cmpe/",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "open1",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            24,
            850,
            225,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "opendialog WAVE AIFF",
          "outlettype": [
            "",
            "bang"
          ]
        }
      },
      {
        "box": {
          "id": "path1",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            24,
            890,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend loadfile 0"
        }
      },
      {
        "box": {
          "id": "repeats1",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            24,
            930,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend repeats 0"
        }
      },
      {
        "box": {
          "id": "source1",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            24,
            990,
            225,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "buffer~ apgw_init1",
          "outlettype": [
            "float",
            "bang"
          ],
          "varname": "source1"
        }
      },
      {
        "box": {
          "id": "loaded_defer1",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            24,
            1030,
            90,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "deferlow"
        }
      },
      {
        "box": {
          "id": "loaded_msg1",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            24,
            1070,
            110,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "loaded 0",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "open2",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            340,
            850,
            225,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "opendialog WAVE AIFF",
          "outlettype": [
            "",
            "bang"
          ]
        }
      },
      {
        "box": {
          "id": "path2",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            340,
            890,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend loadfile 1"
        }
      },
      {
        "box": {
          "id": "repeats2",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            340,
            930,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend repeats 1"
        }
      },
      {
        "box": {
          "id": "source2",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            340,
            990,
            225,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "buffer~ apgw_init2",
          "outlettype": [
            "float",
            "bang"
          ],
          "varname": "source2"
        }
      },
      {
        "box": {
          "id": "loaded_defer2",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            340,
            1030,
            90,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "deferlow"
        }
      },
      {
        "box": {
          "id": "loaded_msg2",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            340,
            1070,
            110,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "loaded 1",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "open3",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            656,
            850,
            225,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "opendialog WAVE AIFF",
          "outlettype": [
            "",
            "bang"
          ]
        }
      },
      {
        "box": {
          "id": "path3",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            656,
            890,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend loadfile 2"
        }
      },
      {
        "box": {
          "id": "repeats3",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            656,
            930,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend repeats 2"
        }
      },
      {
        "box": {
          "id": "source3",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            656,
            990,
            225,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "buffer~ apgw_init3",
          "outlettype": [
            "float",
            "bang"
          ],
          "varname": "source3"
        }
      },
      {
        "box": {
          "id": "loaded_defer3",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            656,
            1030,
            90,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "deferlow"
        }
      },
      {
        "box": {
          "id": "loaded_msg3",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            656,
            1070,
            110,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "loaded 2",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "play_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            24,
            1130,
            112,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "play",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "new_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            145,
            1130,
            112,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "newpiece",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "demo_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            286,
            1130,
            112,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "demos",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "clear_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            407,
            1130,
            112,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "clearloop",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "pitch_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            24,
            1180,
            195,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend pitch"
        }
      },
      {
        "box": {
          "id": "monitor_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            230,
            1180,
            195,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend monitor"
        }
      },
      {
        "box": {
          "id": "loop_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            460,
            1180,
            195,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend loopmode"
        }
      },
      {
        "box": {
          "id": "save_dialog",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            24,
            1230,
            195,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "savedialog WAVE",
          "outlettype": [
            "",
            "bang"
          ]
        }
      },
      {
        "box": {
          "id": "save_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            245,
            1230,
            195,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend savepath"
        }
      },
      {
        "box": {
          "id": "close",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            480,
            1230,
            108,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "closebang"
        }
      },
      {
        "box": {
          "id": "shutdown_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            615,
            1230,
            110,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "shutdown",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "controller",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 4,
          "patching_rect": [
            24,
            1310,
            225,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "js cmpe_variety.js",
          "outlettype": [
            "",
            "",
            "",
            ""
          ],
          "varname": "controller"
        }
      },
      {
        "box": {
          "id": "output_buffer",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            300,
            1310,
            285,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "buffer~ apgw_out_init 1 2",
          "outlettype": [
            "float",
            "bang"
          ],
          "varname": "output_buffer"
        }
      },
      {
        "box": {
          "id": "save_complete_defer",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            880,
            1310,
            100,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "deferlow"
        }
      },
      {
        "box": {
          "id": "save_complete_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1005,
            1310,
            85,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "saved",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "wave_link",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            650,
            1310,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "t l",
          "outlettype": [
            "list"
          ],
          "varname": "wave_link"
        }
      },
      {
        "box": {
          "id": "wave_change_l",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            300,
            1370,
            240,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend wavechange"
        }
      },
      {
        "box": {
          "id": "wave_mouse_l",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            575,
            1370,
            240,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend wavemouse"
        }
      },
      {
        "box": {
          "id": "wave_change_r",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            300,
            1410,
            240,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend wavechange"
        }
      },
      {
        "box": {
          "id": "wave_mouse_r",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            575,
            1410,
            240,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend wavemouse"
        }
      },
      {
        "box": {
          "id": "groove",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 3,
          "patching_rect": [
            24,
            1500,
            490,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "groove~ apgw_out_init 2 @loop 1 @loopinterp 1",
          "outlettype": [
            "signal",
            "signal",
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "speed",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            24,
            1450,
            95,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "sig~ 0.",
          "outlettype": [
            "signal"
          ],
          "varname": "speed"
        }
      },
      {
        "box": {
          "id": "run_gate",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            550,
            1500,
            110,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "line~ 0.",
          "outlettype": [
            "signal",
            "bang"
          ],
          "varname": "run_gate"
        }
      },
      {
        "box": {
          "id": "clock",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            730,
            1500,
            175,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "count~ 0 0 0 0",
          "outlettype": [
            "signal"
          ],
          "varname": "clock"
        }
      },
      {
        "box": {
          "id": "phase_snapshot",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            24,
            1560,
            145,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "snapshot~ 33",
          "outlettype": [
            "float"
          ]
        }
      },
      {
        "box": {
          "id": "phase_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            24,
            1600,
            160,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend phase"
        }
      },
      {
        "box": {
          "id": "total_frames",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            920,
            1500,
            205,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "sig~ 2147483647.",
          "outlettype": [
            "signal"
          ],
          "varname": "total_frames"
        }
      },
      {
        "box": {
          "id": "loop_flag",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1185,
            1500,
            105,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "sig~ 0.",
          "outlettype": [
            "signal"
          ],
          "varname": "loop_flag"
        }
      },
      {
        "box": {
          "id": "reached_end",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            730,
            1560,
            70,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": ">=~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "one_shot",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1185,
            1560,
            95,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "!-~ 1.",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "done",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            920,
            1620,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "done_edge",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            920,
            1670,
            80,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "edge~",
          "outlettype": [
            "bang",
            "bang"
          ]
        }
      },
      {
        "box": {
          "id": "play_token",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1025,
            1670,
            60,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "i 0",
          "outlettype": [
            "int"
          ],
          "varname": "play_token"
        }
      },
      {
        "box": {
          "id": "done_defer",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1025,
            1710,
            100,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "deferlow"
        }
      },
      {
        "box": {
          "id": "ended_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1025,
            1750,
            175,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend ended"
        }
      },
      {
        "box": {
          "id": "not_done",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            730,
            1670,
            95,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "!-~ 1.",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "edge_scale",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            370,
            1560,
            135,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "sig~ 200.",
          "outlettype": [
            "signal"
          ],
          "varname": "edge_scale"
        }
      },
      {
        "box": {
          "id": "attack",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            210,
            1620,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "reverse_phase",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            370,
            1620,
            100,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "!-~ 1.",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "release",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            370,
            1670,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "edge_min",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            210,
            1720,
            125,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "minimum~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "edge_envelope",
          "maxclass": "newobj",
          "numinlets": 3,
          "numoutlets": 1,
          "patching_rect": [
            210,
            1770,
            125,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "clip~ 0. 1.",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "one_shot_gate",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            550,
            1770,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "amplitude_gate",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            550,
            1820,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "dsp_info",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 4,
          "patching_rect": [
            1025,
            1820,
            125,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "dspstate~",
          "outlettype": [
            "int",
            "float",
            "int",
            "int"
          ],
          "varname": "dsp_info"
        }
      },
      {
        "box": {
          "id": "dsp_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            920,
            1870,
            195,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend dspstate"
        }
      },
      {
        "box": {
          "id": "samplerate_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1140,
            1870,
            225,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend samplerate"
        }
      },
      {
        "box": {
          "id": "monitor_gain",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            550,
            2070,
            205,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "line~ 0.25118864",
          "outlettype": [
            "signal",
            "bang"
          ],
          "varname": "monitor_gain"
        }
      },
      {
        "box": {
          "id": "audio_driver",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 0,
          "patching_rect": [
            24,
            2190,
            120,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "dac~ 1 2",
          "varname": "audio_driver"
        }
      },
      {
        "box": {
          "id": "test_trigger",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            1460,
            850,
            90,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
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
          "id": "audio_on",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1590,
            850,
            135,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "startwindow",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "test_status",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            900,
            430,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "set Test sound: listen for a short tone.",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "test_delay",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            950,
            115,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "delay 200",
          "outlettype": [
            "bang"
          ]
        }
      },
      {
        "box": {
          "id": "test_envelope_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1000,
            350,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "0., 0.12 10 0.12 250 0. 20",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "test_envelope",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            1460,
            1050,
            110,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "line~ 0.",
          "outlettype": [
            "signal",
            "bang"
          ]
        }
      },
      {
        "box": {
          "id": "test_oscillator",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1630,
            1050,
            125,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "cycle~ 440",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "test_product",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1100,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "stop_trigger",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            1460,
            1180,
            90,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
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
          "id": "test_stop_delay",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1740,
            1230,
            75,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "stop",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "native_stop_fade",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1590,
            1230,
            85,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "0. 10",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "varname": "live_stop"
        }
      },
      {
        "box": {
          "id": "stop_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1230,
            75,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "stop",
          "outlettype": [
            ""
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "gate_L",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            24,
            1900,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "listen_sum_L",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            24,
            1970,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "monitor_L",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            24,
            2070,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "gate_R",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            260,
            1900,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "listen_sum_R",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            260,
            1970,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "monitor_R",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            260,
            2070,
            55,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ]
        }
      },
      {
        "box": {
          "id": "backend_note",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            2270,
            1100,
            86
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Finite audio: rendered stereo buffer -> existing APG transport. Live audio: poly~ voices -> live gate.\nBoth paths enter the common monitor. TEST SOUND remains independent; native STOP fades both paths.\nLive recording is before monitor volume and excludes TEST SOUND. Original CMPE: Joo Won Park / joowonpark.net/cmpe.",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "save_preset",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            522,
            54,
            124,
            26
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "SAVE SET",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "save_preset",
          "presentation": 1,
          "presentation_rect": [
            522,
            54,
            124,
            26
          ],
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 3,
          "bgcolor": [
            0.92,
            0.92,
            0.92,
            1.0
          ],
          "bgoncolor": [
            0.76,
            0.76,
            0.76,
            1
          ],
          "textoncolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "textovercolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "load_preset",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            660,
            54,
            156,
            26
          ],
          "fontname": "Arial",
          "fontsize": 16.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "LOAD SET",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "load_preset",
          "presentation": 1,
          "presentation_rect": [
            660,
            54,
            156,
            26
          ],
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 3,
          "bgcolor": [
            0.92,
            0.92,
            0.92,
            1.0
          ],
          "bgoncolor": [
            0.76,
            0.76,
            0.76,
            1
          ],
          "textoncolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "textovercolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "mode0",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            24,
            88,
            152,
            36
          ],
          "fontname": "Arial",
          "fontsize": 21.0,
          "textcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "text": "APG",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "mode0",
          "presentation": 1,
          "presentation_rect": [
            24,
            88,
            152,
            36
          ],
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 3,
          "bgcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "bgoncolor": [
            0.24,
            0.24,
            0.24,
            1
          ],
          "textoncolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "textovercolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose the APG instrument."
        }
      },
      {
        "box": {
          "id": "mode_msg0",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1390,
            130,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "mode 0",
          "outlettype": [
            ""
          ],
          "varname": "mode_msg0",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "mode1",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            184,
            88,
            152,
            36
          ],
          "fontname": "Arial",
          "fontsize": 21.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "ISJS",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "mode1",
          "presentation": 1,
          "presentation_rect": [
            184,
            88,
            152,
            36
          ],
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 3,
          "bgcolor": [
            0.92,
            0.92,
            0.92,
            1.0
          ],
          "bgoncolor": [
            0.76,
            0.76,
            0.76,
            1
          ],
          "textoncolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "textovercolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose the ISJS instrument."
        }
      },
      {
        "box": {
          "id": "mode_msg1",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1605,
            1390,
            130,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "mode 1",
          "outlettype": [
            ""
          ],
          "varname": "mode_msg1",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "mode2",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            344,
            88,
            152,
            36
          ],
          "fontname": "Arial",
          "fontsize": 21.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Many",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "mode2",
          "presentation": 1,
          "presentation_rect": [
            344,
            88,
            152,
            36
          ],
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 3,
          "bgcolor": [
            0.92,
            0.92,
            0.92,
            1.0
          ],
          "bgoncolor": [
            0.76,
            0.76,
            0.76,
            1
          ],
          "textoncolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "textovercolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose the Many instrument."
        }
      },
      {
        "box": {
          "id": "mode_msg2",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1750,
            1390,
            130,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "mode 2",
          "outlettype": [
            ""
          ],
          "varname": "mode_msg2",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "mode3",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            504,
            88,
            152,
            36
          ],
          "fontname": "Arial",
          "fontsize": 21.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "RMHS",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "mode3",
          "presentation": 1,
          "presentation_rect": [
            504,
            88,
            152,
            36
          ],
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 3,
          "bgcolor": [
            0.92,
            0.92,
            0.92,
            1.0
          ],
          "bgoncolor": [
            0.76,
            0.76,
            0.76,
            1
          ],
          "textoncolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "textovercolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose the RMHS instrument."
        }
      },
      {
        "box": {
          "id": "mode_msg3",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1895,
            1390,
            130,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "mode 3",
          "outlettype": [
            ""
          ],
          "varname": "mode_msg3",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "mode4",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            664,
            88,
            152,
            36
          ],
          "fontname": "Arial",
          "fontsize": 21.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "SIOE",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "mode4",
          "presentation": 1,
          "presentation_rect": [
            664,
            88,
            152,
            36
          ],
          "hidden": 0,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 3,
          "bgcolor": [
            0.92,
            0.92,
            0.92,
            1.0
          ],
          "bgoncolor": [
            0.76,
            0.76,
            0.76,
            1
          ],
          "textoncolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "textovercolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Choose the SIOE instrument."
        }
      },
      {
        "box": {
          "id": "mode_msg4",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            2040,
            1390,
            130,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "mode 4",
          "outlettype": [
            ""
          ],
          "varname": "mode_msg4",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "mode_info",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            132,
            792,
            25
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "APG / Audio Palindrome Generator",
          "varname": "mode_info",
          "presentation": 1,
          "presentation_rect": [
            24,
            132,
            792,
            25
          ],
          "hidden": 0,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "no_samples",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            184,
            792,
            56
          ],
          "fontname": "Arial",
          "fontsize": 18.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "RMHS creates its own sound. No samples are needed.",
          "varname": "no_samples",
          "presentation": 1,
          "presentation_rect": [
            24,
            184,
            792,
            56
          ],
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "linecount": 2
        }
      },
      {
        "box": {
          "id": "param_label0",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            258,
            248,
            23
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Parameter 1",
          "varname": "param_label0",
          "presentation": 1,
          "presentation_rect": [
            24,
            258,
            248,
            23
          ],
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "param0",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            24,
            284,
            248,
            30
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "param0",
          "presentation": 1,
          "presentation_rect": [
            24,
            284,
            248,
            30
          ],
          "hidden": 1,
          "bgcolor": [
            0.95,
            0.95,
            0.95,
            1
          ],
          "bgoncolor": [
            0.84,
            0.84,
            0.84,
            1
          ],
          "hbgcolor": [
            0.15,
            0.15,
            0.15,
            1
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "triangle": 0,
          "format": 6,
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "param_msg0",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1450,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend param 0",
          "varname": "param_msg0"
        }
      },
      {
        "box": {
          "id": "param_label1",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            296,
            258,
            248,
            23
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Parameter 2",
          "varname": "param_label1",
          "presentation": 1,
          "presentation_rect": [
            296,
            258,
            248,
            23
          ],
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "param1",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            296,
            284,
            248,
            30
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "param1",
          "presentation": 1,
          "presentation_rect": [
            296,
            284,
            248,
            30
          ],
          "hidden": 1,
          "bgcolor": [
            0.95,
            0.95,
            0.95,
            1
          ],
          "bgoncolor": [
            0.84,
            0.84,
            0.84,
            1
          ],
          "hbgcolor": [
            0.15,
            0.15,
            0.15,
            1
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "triangle": 0,
          "format": 6,
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "param_msg1",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1690,
            1450,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend param 1",
          "varname": "param_msg1"
        }
      },
      {
        "box": {
          "id": "param_label2",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            568,
            258,
            248,
            23
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Parameter 3",
          "varname": "param_label2",
          "presentation": 1,
          "presentation_rect": [
            568,
            258,
            248,
            23
          ],
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "param2",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            568,
            284,
            248,
            30
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "param2",
          "presentation": 1,
          "presentation_rect": [
            568,
            284,
            248,
            30
          ],
          "hidden": 1,
          "bgcolor": [
            0.95,
            0.95,
            0.95,
            1
          ],
          "bgoncolor": [
            0.84,
            0.84,
            0.84,
            1
          ],
          "hbgcolor": [
            0.15,
            0.15,
            0.15,
            1
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "triangle": 0,
          "format": 6,
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "param_msg2",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1920,
            1450,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend param 2",
          "varname": "param_msg2"
        }
      },
      {
        "box": {
          "id": "param_label3",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            24,
            322,
            248,
            23
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Parameter 4",
          "varname": "param_label3",
          "presentation": 1,
          "presentation_rect": [
            24,
            322,
            248,
            23
          ],
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "param3",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            24,
            348,
            248,
            30
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "param3",
          "presentation": 1,
          "presentation_rect": [
            24,
            348,
            248,
            30
          ],
          "hidden": 1,
          "bgcolor": [
            0.95,
            0.95,
            0.95,
            1
          ],
          "bgoncolor": [
            0.84,
            0.84,
            0.84,
            1
          ],
          "hbgcolor": [
            0.15,
            0.15,
            0.15,
            1
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "triangle": 0,
          "format": 6,
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "param_msg3",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1490,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend param 3",
          "varname": "param_msg3"
        }
      },
      {
        "box": {
          "id": "param_label4",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            296,
            322,
            248,
            23
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Parameter 5",
          "varname": "param_label4",
          "presentation": 1,
          "presentation_rect": [
            296,
            322,
            248,
            23
          ],
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "param4",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            296,
            348,
            248,
            30
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "param4",
          "presentation": 1,
          "presentation_rect": [
            296,
            348,
            248,
            30
          ],
          "hidden": 1,
          "bgcolor": [
            0.95,
            0.95,
            0.95,
            1
          ],
          "bgoncolor": [
            0.84,
            0.84,
            0.84,
            1
          ],
          "hbgcolor": [
            0.15,
            0.15,
            0.15,
            1
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "triangle": 0,
          "format": 6,
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "param_msg4",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1690,
            1490,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend param 4",
          "varname": "param_msg4"
        }
      },
      {
        "box": {
          "id": "param_label5",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            568,
            322,
            248,
            23
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Parameter 6",
          "varname": "param_label5",
          "presentation": 1,
          "presentation_rect": [
            568,
            322,
            248,
            23
          ],
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "param5",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            568,
            348,
            248,
            30
          ],
          "fontname": "Arial",
          "fontsize": 20.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "param5",
          "presentation": 1,
          "presentation_rect": [
            568,
            348,
            248,
            30
          ],
          "hidden": 1,
          "bgcolor": [
            0.95,
            0.95,
            0.95,
            1
          ],
          "bgoncolor": [
            0.84,
            0.84,
            0.84,
            1
          ],
          "hbgcolor": [
            0.15,
            0.15,
            0.15,
            1
          ],
          "htextcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "tricolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "triangle": 0,
          "format": 6,
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "param_msg5",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1920,
            1490,
            215,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend param 5",
          "varname": "param_msg5"
        }
      },
      {
        "box": {
          "id": "menu_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            568,
            322,
            248,
            23
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "Pitch set",
          "varname": "menu_label",
          "presentation": 1,
          "presentation_rect": [
            568,
            322,
            248,
            23
          ],
          "hidden": 1,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "mode_menu",
          "maxclass": "umenu",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            568,
            348,
            248,
            30
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "outlettype": [
            "int",
            "",
            ""
          ],
          "varname": "mode_menu",
          "presentation": 1,
          "presentation_rect": [
            568,
            348,
            248,
            30
          ],
          "hidden": 1,
          "bgcolor": [
            0.92,
            0.92,
            0.92,
            1.0
          ],
          "items": [
            "Major",
            ",",
            "Minor",
            ",",
            "Pentatonic",
            ",",
            "Atonal",
            ",",
            "Microtonal"
          ],
          "parameter_enable": 0
        }
      },
      {
        "box": {
          "id": "choice_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1540,
            205,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend choice",
          "varname": "choice_msg"
        }
      },
      {
        "box": {
          "id": "scope_l",
          "maxclass": "scope~",
          "numinlets": 2,
          "numoutlets": 0,
          "patching_rect": [
            56,
            416,
            760,
            66
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "varname": "scope_l",
          "presentation": 1,
          "presentation_rect": [
            56,
            416,
            760,
            66
          ],
          "hidden": 1,
          "bgcolor": [
            0.96,
            0.96,
            0.96,
            1
          ],
          "fgcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "gridcolor": [
            0.75,
            0.75,
            0.75,
            1
          ],
          "calccount": 128,
          "bufsize": 256,
          "range": [
            -1.0,
            1.0
          ],
          "delay": 50,
          "trigger": 0
        }
      },
      {
        "box": {
          "id": "scope_r",
          "maxclass": "scope~",
          "numinlets": 2,
          "numoutlets": 0,
          "patching_rect": [
            56,
            488,
            760,
            66
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "varname": "scope_r",
          "presentation": 1,
          "presentation_rect": [
            56,
            488,
            760,
            66
          ],
          "hidden": 1,
          "bgcolor": [
            0.96,
            0.96,
            0.96,
            1
          ],
          "fgcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "gridcolor": [
            0.75,
            0.75,
            0.75,
            1
          ],
          "calccount": 128,
          "bufsize": 256,
          "range": [
            -1.0,
            1.0
          ],
          "delay": 50,
          "trigger": 0
        }
      },
      {
        "box": {
          "id": "xy_pad",
          "maxclass": "jsui",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            56,
            416,
            520,
            138
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "outlettype": [
            ""
          ],
          "varname": "xy_pad",
          "presentation": 1,
          "presentation_rect": [
            56,
            416,
            520,
            138
          ],
          "hidden": 1,
          "filename": "cmpe_xy.js",
          "jsarguments": [],
          "border": 1,
          "parameter_enable": 0,
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "scope_xy",
          "maxclass": "scope~",
          "numinlets": 2,
          "numoutlets": 0,
          "patching_rect": [
            592,
            416,
            224,
            138
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "varname": "scope_xy",
          "presentation": 1,
          "presentation_rect": [
            592,
            416,
            224,
            138
          ],
          "hidden": 1,
          "bgcolor": [
            0.96,
            0.96,
            0.96,
            1
          ],
          "fgcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "gridcolor": [
            0.75,
            0.75,
            0.75,
            1
          ],
          "calccount": 64,
          "bufsize": 256,
          "range": [
            -1.0,
            1.0
          ],
          "delay": 50,
          "trigger": 0
        }
      },
      {
        "box": {
          "id": "record_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            624,
            602,
            192,
            34
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "RECORD WAV",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "varname": "record_button",
          "presentation": 1,
          "presentation_rect": [
            624,
            602,
            192,
            34
          ],
          "hidden": 1,
          "mode": 0,
          "outputmode": 1,
          "usegradient": 0,
          "rounded": 3,
          "bgcolor": [
            0.92,
            0.92,
            0.92,
            1.0
          ],
          "bgoncolor": [
            0.76,
            0.76,
            0.76,
            1
          ],
          "textoncolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "textovercolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "parameter_enable": 0,
          "hint": "Record the current live instrument to a stereo WAV file."
        }
      },
      {
        "box": {
          "id": "recordtoggle_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1600,
            150,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "recordtoggle",
          "outlettype": [
            ""
          ],
          "varname": "recordtoggle_msg",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "record_dialog",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            1460,
            1660,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "savedialog WAVE",
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "record_dialog"
        }
      },
      {
        "box": {
          "id": "record_dialog_path",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1700,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend recordpath",
          "varname": "record_dialog_path"
        }
      },
      {
        "box": {
          "id": "preset_save_dialog",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            1740,
            1660,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "savedialog JSON",
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "preset_save_dialog"
        }
      },
      {
        "box": {
          "id": "preset_save_dialog_path",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            1740,
            1700,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend presetwrite",
          "varname": "preset_save_dialog_path"
        }
      },
      {
        "box": {
          "id": "preset_load_dialog",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            2020,
            1660,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "opendialog JSON",
          "outlettype": [
            "",
            "bang"
          ],
          "varname": "preset_load_dialog"
        }
      },
      {
        "box": {
          "id": "preset_load_dialog_path",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            2020,
            1700,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend presetread",
          "varname": "preset_load_dialog_path"
        }
      },
      {
        "box": {
          "id": "save_preset_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1740,
            1600,
            180,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "presetsave",
          "outlettype": [
            ""
          ],
          "varname": "save_preset_msg",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "load_preset_msg",
          "maxclass": "message",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            2020,
            1600,
            180,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "presetload",
          "outlettype": [
            ""
          ],
          "varname": "load_preset_msg",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
        }
      },
      {
        "box": {
          "id": "grain_engine",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            1460,
            1790,
            300,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "poly~ cmpe_sample_voice 3",
          "outlettype": [
            "signal",
            "signal"
          ],
          "varname": "grain_engine"
        }
      },
      {
        "box": {
          "id": "many_engine",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            1780,
            1790,
            300,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "poly~ cmpe_many_voice 32",
          "outlettype": [
            "signal",
            "signal"
          ],
          "varname": "many_engine"
        }
      },
      {
        "box": {
          "id": "drone_engine",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            2100,
            1790,
            300,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "poly~ cmpe_drone_voice 64",
          "outlettype": [
            "signal",
            "signal"
          ],
          "varname": "drone_engine"
        }
      },
      {
        "box": {
          "id": "live_gate",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 2,
          "patching_rect": [
            2440,
            1790,
            130,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "line~ 0.",
          "outlettype": [
            "signal",
            "bang"
          ],
          "varname": "live_gate"
        }
      },
      {
        "box": {
          "id": "recorder",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            2440,
            2110,
            170,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "sfrecord~ 2",
          "outlettype": [
            "signal"
          ],
          "varname": "recorder"
        }
      },
      {
        "box": {
          "id": "record_snapshot",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            2440,
            2160,
            180,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "snapshot~ 250",
          "outlettype": [
            "float"
          ],
          "varname": "record_snapshot"
        }
      },
      {
        "box": {
          "id": "record_elapsed_msg",
          "maxclass": "newobj",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            2440,
            2200,
            235,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "prepend recordelapsed",
          "varname": "record_elapsed_msg"
        }
      },
      {
        "box": {
          "id": "live_pair_L",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1870,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "varname": "live_pair_L"
        }
      },
      {
        "box": {
          "id": "live_sum_L",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1920,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "varname": "live_sum_L"
        }
      },
      {
        "box": {
          "id": "live_L",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            1970,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ],
          "varname": "live_L"
        }
      },
      {
        "box": {
          "id": "program_L",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1460,
            2040,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "varname": "program_L"
        }
      },
      {
        "box": {
          "id": "live_pair_R",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1780,
            1870,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "varname": "live_pair_R"
        }
      },
      {
        "box": {
          "id": "live_sum_R",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1780,
            1920,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "varname": "live_sum_R"
        }
      },
      {
        "box": {
          "id": "live_R",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1780,
            1970,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "*~",
          "outlettype": [
            "signal"
          ],
          "varname": "live_R"
        }
      },
      {
        "box": {
          "id": "program_R",
          "maxclass": "newobj",
          "numinlets": 2,
          "numoutlets": 1,
          "patching_rect": [
            1780,
            2040,
            65,
            24
          ],
          "fontname": "Arial",
          "fontsize": 17.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "+~",
          "outlettype": [
            "signal"
          ],
          "varname": "program_R"
        }
      }
    ],
    "lines": [
      {
        "patchline": {
          "source": [
            "original_link",
            0
          ],
          "destination": [
            "original_url",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "load1",
            0
          ],
          "destination": [
            "open1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "open1",
            0
          ],
          "destination": [
            "path1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "path1",
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
            "repeat1",
            0
          ],
          "destination": [
            "repeats1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "repeats1",
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
            "source1",
            1
          ],
          "destination": [
            "loaded_defer1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "loaded_defer1",
            0
          ],
          "destination": [
            "loaded_msg1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "loaded_msg1",
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
            "load2",
            0
          ],
          "destination": [
            "open2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "open2",
            0
          ],
          "destination": [
            "path2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "path2",
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
            "repeat2",
            0
          ],
          "destination": [
            "repeats2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "repeats2",
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
            "source2",
            1
          ],
          "destination": [
            "loaded_defer2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "loaded_defer2",
            0
          ],
          "destination": [
            "loaded_msg2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "loaded_msg2",
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
            "load3",
            0
          ],
          "destination": [
            "open3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "open3",
            0
          ],
          "destination": [
            "path3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "path3",
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
            "repeat3",
            0
          ],
          "destination": [
            "repeats3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "repeats3",
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
            "source3",
            1
          ],
          "destination": [
            "loaded_defer3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "loaded_defer3",
            0
          ],
          "destination": [
            "loaded_msg3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "loaded_msg3",
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
            "play_button",
            0
          ],
          "destination": [
            "play_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "play_msg",
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
            "new_button",
            0
          ],
          "destination": [
            "new_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "new_msg",
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
            "demo_button",
            0
          ],
          "destination": [
            "demo_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "demo_msg",
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
            "clear_button",
            0
          ],
          "destination": [
            "clear_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "clear_msg",
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
            "pitch",
            0
          ],
          "destination": [
            "pitch_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "pitch_msg",
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
            "monitor_level",
            0
          ],
          "destination": [
            "monitor_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "monitor_msg",
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
            "loop_toggle",
            0
          ],
          "destination": [
            "loop_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "loop_msg",
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
            "save_button",
            0
          ],
          "destination": [
            "save_dialog",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "save_dialog",
            0
          ],
          "destination": [
            "save_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "save_msg",
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
            "close",
            0
          ],
          "destination": [
            "shutdown_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "shutdown_msg",
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
            "output_buffer",
            1
          ],
          "destination": [
            "save_complete_defer",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "save_complete_defer",
            0
          ],
          "destination": [
            "save_complete_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "save_complete_msg",
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
            "wave_link",
            0
          ],
          "destination": [
            "wave_l",
            4
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "wave_l",
            5
          ],
          "destination": [
            "wave_r",
            4
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "wave_l",
            5
          ],
          "destination": [
            "wave_change_l",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "wave_change_l",
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
            "wave_l",
            4
          ],
          "destination": [
            "wave_mouse_l",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "wave_mouse_l",
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
            "wave_r",
            5
          ],
          "destination": [
            "wave_l",
            4
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "wave_r",
            5
          ],
          "destination": [
            "wave_change_r",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "wave_change_r",
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
            "wave_r",
            4
          ],
          "destination": [
            "wave_mouse_r",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "wave_mouse_r",
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
            "groove",
            0
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
            "speed",
            0
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
            "run_gate",
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
            "clock",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "speed",
            0
          ],
          "destination": [
            "groove",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "groove",
            2
          ],
          "destination": [
            "phase_snapshot",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "phase_snapshot",
            0
          ],
          "destination": [
            "phase_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "phase_msg",
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
            "clock",
            0
          ],
          "destination": [
            "reached_end",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "total_frames",
            0
          ],
          "destination": [
            "reached_end",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "loop_flag",
            0
          ],
          "destination": [
            "one_shot",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "reached_end",
            0
          ],
          "destination": [
            "done",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "one_shot",
            0
          ],
          "destination": [
            "done",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "done",
            0
          ],
          "destination": [
            "done_edge",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "done",
            0
          ],
          "destination": [
            "not_done",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "done_edge",
            0
          ],
          "destination": [
            "play_token",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "play_token",
            0
          ],
          "destination": [
            "done_defer",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "done_defer",
            0
          ],
          "destination": [
            "ended_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "ended_msg",
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
            "groove",
            2
          ],
          "destination": [
            "attack",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "groove",
            2
          ],
          "destination": [
            "reverse_phase",
            0
          ],
          "order": 2
        }
      },
      {
        "patchline": {
          "source": [
            "edge_scale",
            0
          ],
          "destination": [
            "attack",
            1
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "reverse_phase",
            0
          ],
          "destination": [
            "release",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "edge_scale",
            0
          ],
          "destination": [
            "release",
            1
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "attack",
            0
          ],
          "destination": [
            "edge_min",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "release",
            0
          ],
          "destination": [
            "edge_min",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "edge_min",
            0
          ],
          "destination": [
            "edge_envelope",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "edge_envelope",
            0
          ],
          "destination": [
            "one_shot_gate",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "not_done",
            0
          ],
          "destination": [
            "one_shot_gate",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "one_shot_gate",
            0
          ],
          "destination": [
            "amplitude_gate",
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
            "amplitude_gate",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "dsp_info",
            0
          ],
          "destination": [
            "dsp_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "dsp_msg",
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
            "dsp_info",
            1
          ],
          "destination": [
            "samplerate_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "samplerate_msg",
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
            "test_audio",
            0
          ],
          "destination": [
            "test_trigger",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "test_trigger",
            2
          ],
          "destination": [
            "audio_on",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "audio_on",
            0
          ],
          "destination": [
            "audio_driver",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "test_trigger",
            1
          ],
          "destination": [
            "test_status",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "test_status",
            0
          ],
          "destination": [
            "status",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "test_trigger",
            0
          ],
          "destination": [
            "test_delay",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "test_delay",
            0
          ],
          "destination": [
            "test_envelope_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "test_envelope_msg",
            0
          ],
          "destination": [
            "test_envelope",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "test_envelope",
            0
          ],
          "destination": [
            "test_product",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "test_oscillator",
            0
          ],
          "destination": [
            "test_product",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stop_button",
            0
          ],
          "destination": [
            "stop_trigger",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stop_trigger",
            2
          ],
          "destination": [
            "test_stop_delay",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "test_stop_delay",
            0
          ],
          "destination": [
            "test_delay",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stop_trigger",
            1
          ],
          "destination": [
            "native_stop_fade",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "native_stop_fade",
            0
          ],
          "destination": [
            "test_envelope",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "native_stop_fade",
            0
          ],
          "destination": [
            "run_gate",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "stop_trigger",
            0
          ],
          "destination": [
            "stop_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "stop_msg",
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
            "groove",
            0
          ],
          "destination": [
            "gate_L",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "amplitude_gate",
            0
          ],
          "destination": [
            "gate_L",
            1
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "test_product",
            0
          ],
          "destination": [
            "listen_sum_L",
            1
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "listen_sum_L",
            0
          ],
          "destination": [
            "monitor_L",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "monitor_gain",
            0
          ],
          "destination": [
            "monitor_L",
            1
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "monitor_L",
            0
          ],
          "destination": [
            "meter_L",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "monitor_L",
            0
          ],
          "destination": [
            "audio_driver",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "groove",
            1
          ],
          "destination": [
            "gate_R",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "amplitude_gate",
            0
          ],
          "destination": [
            "gate_R",
            1
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "test_product",
            0
          ],
          "destination": [
            "listen_sum_R",
            1
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "listen_sum_R",
            0
          ],
          "destination": [
            "monitor_R",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "monitor_gain",
            0
          ],
          "destination": [
            "monitor_R",
            1
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "monitor_R",
            0
          ],
          "destination": [
            "meter_R",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "monitor_R",
            0
          ],
          "destination": [
            "audio_driver",
            1
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "mode0",
            0
          ],
          "destination": [
            "mode_msg0",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mode_msg0",
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
            "mode1",
            0
          ],
          "destination": [
            "mode_msg1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mode_msg1",
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
            "mode2",
            0
          ],
          "destination": [
            "mode_msg2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mode_msg2",
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
            "mode3",
            0
          ],
          "destination": [
            "mode_msg3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mode_msg3",
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
            "mode4",
            0
          ],
          "destination": [
            "mode_msg4",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mode_msg4",
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
            "param0",
            0
          ],
          "destination": [
            "param_msg0",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "param_msg0",
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
            "param1",
            0
          ],
          "destination": [
            "param_msg1",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "param_msg1",
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
            "param2",
            0
          ],
          "destination": [
            "param_msg2",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "param_msg2",
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
            "param3",
            0
          ],
          "destination": [
            "param_msg3",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "param_msg3",
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
            "param4",
            0
          ],
          "destination": [
            "param_msg4",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "param_msg4",
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
            "param5",
            0
          ],
          "destination": [
            "param_msg5",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "param_msg5",
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
            "mode_menu",
            0
          ],
          "destination": [
            "choice_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "choice_msg",
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
            "xy_pad",
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
            "record_button",
            0
          ],
          "destination": [
            "recordtoggle_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "recordtoggle_msg",
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
            "record_dialog",
            0
          ],
          "destination": [
            "record_dialog_path",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "record_dialog_path",
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
            "preset_save_dialog",
            0
          ],
          "destination": [
            "preset_save_dialog_path",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "preset_save_dialog_path",
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
            "preset_load_dialog",
            0
          ],
          "destination": [
            "preset_load_dialog_path",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "preset_load_dialog_path",
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
            "save_preset",
            0
          ],
          "destination": [
            "save_preset_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "save_preset_msg",
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
            "load_preset",
            0
          ],
          "destination": [
            "load_preset_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "load_preset_msg",
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
            "native_stop_fade",
            0
          ],
          "destination": [
            "live_gate",
            0
          ],
          "order": 2
        }
      },
      {
        "patchline": {
          "source": [
            "recorder",
            0
          ],
          "destination": [
            "record_snapshot",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "record_snapshot",
            0
          ],
          "destination": [
            "record_elapsed_msg",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "record_elapsed_msg",
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
            "grain_engine",
            0
          ],
          "destination": [
            "live_pair_L",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "many_engine",
            0
          ],
          "destination": [
            "live_pair_L",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "live_pair_L",
            0
          ],
          "destination": [
            "live_sum_L",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "drone_engine",
            0
          ],
          "destination": [
            "live_sum_L",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "live_sum_L",
            0
          ],
          "destination": [
            "live_L",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "live_gate",
            0
          ],
          "destination": [
            "live_L",
            1
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "live_L",
            0
          ],
          "destination": [
            "scope_l",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "live_L",
            0
          ],
          "destination": [
            "scope_xy",
            0
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "live_L",
            0
          ],
          "destination": [
            "recorder",
            0
          ],
          "order": 2
        }
      },
      {
        "patchline": {
          "source": [
            "gate_L",
            0
          ],
          "destination": [
            "program_L",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "live_L",
            0
          ],
          "destination": [
            "program_L",
            1
          ],
          "order": 3
        }
      },
      {
        "patchline": {
          "source": [
            "program_L",
            0
          ],
          "destination": [
            "listen_sum_L",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "grain_engine",
            1
          ],
          "destination": [
            "live_pair_R",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "many_engine",
            1
          ],
          "destination": [
            "live_pair_R",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "live_pair_R",
            0
          ],
          "destination": [
            "live_sum_R",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "drone_engine",
            1
          ],
          "destination": [
            "live_sum_R",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "live_sum_R",
            0
          ],
          "destination": [
            "live_R",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "live_gate",
            0
          ],
          "destination": [
            "live_R",
            1
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "live_R",
            0
          ],
          "destination": [
            "scope_r",
            0
          ],
          "order": 0
        }
      },
      {
        "patchline": {
          "source": [
            "live_R",
            0
          ],
          "destination": [
            "scope_xy",
            1
          ],
          "order": 1
        }
      },
      {
        "patchline": {
          "source": [
            "live_R",
            0
          ],
          "destination": [
            "recorder",
            1
          ],
          "order": 2
        }
      },
      {
        "patchline": {
          "source": [
            "gate_R",
            0
          ],
          "destination": [
            "program_R",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "live_R",
            0
          ],
          "destination": [
            "program_R",
            1
          ],
          "order": 3
        }
      },
      {
        "patchline": {
          "source": [
            "program_R",
            0
          ],
          "destination": [
            "listen_sum_R",
            0
          ]
        }
      }
    ],
    "autosave": 0,
    "dependency_cache": [
      {
        "name": "cmpe_variety.js",
        "type": "TEXT",
        "implicit": 1
      },
      {
        "name": "cmpe_xy.js",
        "type": "TEXT",
        "implicit": 1
      },
      {
        "name": "cmpe_sample_voice.maxpat",
        "type": "JSON",
        "implicit": 1
      },
      {
        "name": "cmpe_many_voice.maxpat",
        "type": "JSON",
        "implicit": 1
      },
      {
        "name": "cmpe_drone_voice.maxpat",
        "type": "JSON",
        "implicit": 1
      }
    ]
  }
}
