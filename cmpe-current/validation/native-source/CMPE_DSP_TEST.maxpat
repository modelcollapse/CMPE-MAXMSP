{
  "patcher": {
    "fileversion": 1,
    "classnamespace": "box",
    "rect": [
      180,
      180,
      600,
      280
    ],
    "title": "CMPE isolated DSP verification (temporary)",
    "boxes": [
      {
        "box": {
          "id": "osc",
          "maxclass": "newobj",
          "text": "cycle~ 330",
          "varname": "osc",
          "patching_rect": [
            20,
            20,
            180,
            22
          ]
        }
      },
      {
        "box": {
          "id": "gain",
          "maxclass": "newobj",
          "text": "*~ 0.08",
          "varname": "gain",
          "patching_rect": [
            20,
            60,
            180,
            22
          ]
        }
      },
      {
        "box": {
          "id": "bus",
          "maxclass": "newobj",
          "text": "cmpe_fx_bus",
          "varname": "bus",
          "patching_rect": [
            20,
            100,
            180,
            22
          ]
        }
      },
      {
        "box": {
          "id": "mute",
          "maxclass": "newobj",
          "text": "*~ 0.",
          "varname": "mute",
          "patching_rect": [
            20,
            140,
            180,
            22
          ]
        }
      },
      {
        "box": {
          "id": "dac",
          "maxclass": "newobj",
          "text": "dac~ 1 2",
          "varname": "dac",
          "patching_rect": [
            20,
            180,
            180,
            22
          ]
        }
      },
      {
        "box": {
          "id": "probe",
          "maxclass": "newobj",
          "text": "js native_dsp_probe.js",
          "varname": "probe",
          "patching_rect": [
            300,
            20,
            180,
            22
          ]
        }
      }
    ],
    "lines": [
      {
        "patchline": {
          "source": [
            "osc",
            0
          ],
          "destination": [
            "gain",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "gain",
            0
          ],
          "destination": [
            "bus",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "gain",
            0
          ],
          "destination": [
            "bus",
            1
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "bus",
            0
          ],
          "destination": [
            "mute",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mute",
            0
          ],
          "destination": [
            "dac",
            0
          ]
        }
      },
      {
        "patchline": {
          "source": [
            "mute",
            0
          ],
          "destination": [
            "dac",
            1
          ]
        }
      }
    ]
  }
}