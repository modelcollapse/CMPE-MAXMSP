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
      820
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
    "title": "APG Wave v5 / Audio palindrome",
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
            420,
            40
          ],
          "fontname": "Arial",
          "fontsize": 32.0,
          "textcolor": [
            0.04,
            0.04,
            0.04,
            1.0
          ],
          "text": "APG Wave",
          "presentation": 1,
          "presentation_rect": [
            24,
            13,
            420,
            40
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "fontface": 1
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
            420,
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
          "text": "Audio palindrome generator",
          "presentation": 1,
          "presentation_rect": [
            26,
            54,
            420,
            25
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
          "id": "demo_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            522,
            25,
            124,
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
          "text": "DEMO",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            522,
            25,
            124,
            34
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
            25,
            156,
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
          "text": "TEST SOUND",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            660,
            25,
            156,
            34
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
          "presentation": 1,
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
          "ignoreclick": 1
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
          "presentation": 1,
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
          "ignoreclick": 1
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
            772,
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
            772,
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
          "ignoreclick": 1
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
            101,
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
            101,
            116,
            26
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "fontface": 1
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
            97,
            114,
            33
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
            97,
            114,
            33
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
          "hint": "Choose a mono or stereo WAV/AIFF for sample 1."
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
            139,
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
            139,
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
          "linecount": 2
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
            194,
            114,
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
          "text": "Repeats",
          "presentation": 1,
          "presentation_rect": [
            24,
            194,
            114,
            26
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
          "id": "repeat1",
          "maxclass": "number",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            160,
            189,
            112,
            32
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
            160,
            189,
            112,
            32
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
          "maximum": 20
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
            101,
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
            101,
            116,
            26
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "fontface": 1
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
            97,
            114,
            33
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
            97,
            114,
            33
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
          "hint": "Choose a mono or stereo WAV/AIFF for sample 2."
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
            139,
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
            139,
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
          "linecount": 2
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
            194,
            114,
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
          "text": "Repeats",
          "presentation": 1,
          "presentation_rect": [
            296,
            194,
            114,
            26
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
          "id": "repeat2",
          "maxclass": "number",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            432,
            189,
            112,
            32
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
            432,
            189,
            112,
            32
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
          "maximum": 20
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
            101,
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
            101,
            116,
            26
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "fontface": 1
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
            97,
            114,
            33
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
            97,
            114,
            33
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
          "hint": "Choose a mono or stereo WAV/AIFF for sample 3."
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
            139,
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
            139,
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
          "linecount": 2
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
            194,
            114,
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
          "text": "Repeats",
          "presentation": 1,
          "presentation_rect": [
            568,
            194,
            114,
            26
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
          "id": "repeat3",
          "maxclass": "number",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            704,
            189,
            112,
            32
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
            704,
            189,
            112,
            32
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
          "maximum": 20
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
            242,
            112,
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
          "text": "Pitch range",
          "presentation": 1,
          "presentation_rect": [
            24,
            242,
            112,
            26
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
          "id": "pitch",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            139,
            236,
            90,
            34
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
            139,
            236,
            90,
            34
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
          "format": 6
        }
      },
      {
        "box": {
          "id": "monitor_label",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            296,
            242,
            122,
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
          "text": "Volume (dB)",
          "presentation": 1,
          "presentation_rect": [
            296,
            242,
            122,
            26
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
          "id": "monitor_level",
          "maxclass": "flonum",
          "numinlets": 1,
          "numoutlets": 2,
          "patching_rect": [
            424,
            236,
            90,
            34
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
            424,
            236,
            90,
            34
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
          "presentation": 1,
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
          ]
        }
      },
      {
        "box": {
          "id": "meter_L",
          "maxclass": "meter~",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            674,
            240,
            142,
            11
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
            674,
            240,
            142,
            11
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
          "orientation": 1
        }
      },
      {
        "box": {
          "id": "meter_R",
          "maxclass": "meter~",
          "numinlets": 1,
          "numoutlets": 1,
          "patching_rect": [
            674,
            257,
            142,
            11
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
            674,
            257,
            142,
            11
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
          "orientation": 1
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
            286,
            130,
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
          "text": "OUTPUT",
          "presentation": 1,
          "presentation_rect": [
            24,
            286,
            130,
            27
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "fontface": 1
        }
      },
      {
        "box": {
          "id": "duration",
          "maxclass": "comment",
          "numinlets": 1,
          "numoutlets": 0,
          "patching_rect": [
            166,
            286,
            365,
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
          "text": "Length: --",
          "presentation": 1,
          "presentation_rect": [
            166,
            286,
            365,
            27
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
            562,
            286,
            254,
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
            562,
            286,
            254,
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
            352,
            28,
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
          "text": "L",
          "presentation": 1,
          "presentation_rect": [
            24,
            352,
            28,
            27
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "fontface": 1
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
            318,
            760,
            96
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
            318,
            760,
            96
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
          "hint": "Drag across the waveform to choose a playback or loop range."
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
            454,
            28,
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
          "text": "R",
          "presentation": 1,
          "presentation_rect": [
            24,
            454,
            28,
            27
          ],
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ],
          "fontface": 1
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
            420,
            760,
            96
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
            420,
            760,
            96
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
          "hint": "Drag across the waveform to choose a playback or loop range."
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
            524,
            792,
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
          "text": "Drag across the waveform to select a range.",
          "presentation": 1,
          "presentation_rect": [
            24,
            524,
            792,
            26
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
            570,
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
            570,
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
          "hint": "Repeat the selected range. Turn off to play it once."
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
            568,
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
            568,
            320,
            28
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
          "id": "clear_button",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            424,
            560,
            182,
            38
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
            560,
            182,
            38
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
          "hint": "Reset the selected range to the entire rendered piece."
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
            560,
            192,
            38
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
            560,
            192,
            38
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
          "hint": "Save the complete rendered piece as a WAV file."
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
            610,
            380,
            56
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
            610,
            380,
            56
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
          "hint": "Play the current render. A new piece is prepared only when needed."
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
            610,
            190,
            56
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
            610,
            190,
            56
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
          "hint": "Stop playback or cancel preparation."
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
            610,
            190,
            56
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
            610,
            190,
            56
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
          "hint": "Make a new random palindrome from the current three sounds."
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
            678,
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
            678,
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
            692,
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
            692,
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
            721,
            792,
            45
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
            721,
            792,
            45
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
            782,
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
          "text": "Original APG by Joo Won Park",
          "presentation": 1,
          "presentation_rect": [
            24,
            782,
            498,
            26
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
          "id": "original_link",
          "maxclass": "textbutton",
          "numinlets": 1,
          "numoutlets": 3,
          "patching_rect": [
            548,
            779,
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
          "text": "joowonpark.net/apg",
          "outlettype": [
            "",
            "",
            "int"
          ],
          "presentation": 1,
          "presentation_rect": [
            548,
            779,
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
          "hint": "Open Joo Won Park's original Audio Palindrome Generator."
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
          "text": "; max launchbrowser https://joowonpark.net/apg/",
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
          "text": "js apg_wave.js",
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
          ]
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
          "text": "Native audio: rendered stereo buffer -> groove~ -> edge fades + one-shot mask -> monitor -> dac~.\nThe test tone bypasses rendering and playback gates. STOP always fades both paths.\nOriginal APG: Joo Won Park / joowonpark.net/apg. Max adaptation with output waveform and loop selection.",
          "bgcolor": [
            1.0,
            1.0,
            1.0,
            1.0
          ]
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
            "gate_L",
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
            "gate_R",
            0
          ],
          "destination": [
            "listen_sum_R",
            0
          ]
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
      }
    ],
    "autosave": 0,
    "dependency_cache": [
      {
        "name": "apg_wave.js",
        "type": "TEXT",
        "implicit": 1
      }
    ]
  }
}
