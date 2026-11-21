# Attribution

## Original CMPE instruments

**Computer Music Practice Examples (CMPE)** and its Variety Pack are projects by **Joo Won Park**.

Original collection: **https://joowonpark.net/cmpe/**

The supplied `CMPE_VarietyPack_ForSC.scd` identifies Park as its author and contains APG, ISJS, Many, RMHS, and SIOE. This Max collection follows those five musical designs: an audio palindrome, mouse-controlled sample granulation, reverb-based ambient layers, additive drones, and audio supercuts. The original CMPE page links the individual instruments, educational material, SuperCollider code, and the all-in-one Variety Pack.

`CMPE_Variety_Pack.maxpat` and the runtime source include this credit. Its visible project link opens Park's CMPE page. The adaptation uses native Max voices for the live instruments and the APG Wave buffer-rendering interface for APG and SIOE. Precise mappings and intentional implementation differences are documented in [CMPE validation](developer/CMPE_VALIDATION.md).

## Original APG idea and algorithm

**Audio Palindrome Generator (APG)** is a project by **Joo Won Park**.

Original project: **https://joowonpark.net/apg/**

The project page describes a generator that combines three audio files into a sonic palindrome, links to the original app and SuperCollider patch, and requests proper credit when APG is used in another project. The page is dated July 28, 2020. The SuperCollider source supplied as the starting point for this adaptation carries a July 16, 2020 update date and identifies APG as part of Park’s [CMPE project](https://joowonpark.net/cmpe/).

APG Wave credits Park for the musical construction: mirrored pairs of sample events with matching amplitude and playback rate, opposite directions, and a symmetric envelope. The initial timeline is twice the duration of the longest source. Automatic trimming can shorten the final result by removing an equal number of samples from both ends.

## This Max adaptation

This repository contains Max/MSP implementations developed for Bryan Collins. APG Wave adds a rendered stereo output, visible generation and playback status, loop selection, automatic silence trimming, and 24-bit WAV export. The CMPE extension adds the other four instruments, live scopes, a local position/density pad, live recording, and JSON settings files. These are adaptations of Park's work; the original musical ideas and algorithms are his.

The original SuperCollider patches, standalone applications, and bundled SuperCollider sound recordings are not included in this repository. The three `apgw_test*.wav` files are synthetic diagnostic sounds generated for this Max implementation.

## Terms and source material

Credit is separate from licensing. The original APG page’s request for credit is recorded here without assigning a new license to Park’s work or inventing additional permissions. Refer to the original project and its supplied files for any applicable terms.

The original APG page was checked on November 20, 2026; the CMPE page was checked on November 21, 2026. The non-`www` addresses above were used.
