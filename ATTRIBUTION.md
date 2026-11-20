# Attribution

## Original idea and algorithm

**Audio Palindrome Generator (APG)** is a project by **Joo Won Park**.

Original project: **https://joowonpark.net/apg/**

The project page describes a generator that combines three audio files into a sonic palindrome, links to the original app and SuperCollider patch, and requests proper credit when APG is used in another project. The page is dated July 28, 2020. The SuperCollider source supplied as the starting point for this adaptation carries a July 16, 2020 update date and identifies APG as part of Park’s [CMPE project](https://joowonpark.net/cmpe/).

APG Wave credits Park for the musical construction: mirrored pairs of sample events with matching amplitude and playback rate, opposite directions, and a symmetric envelope. The initial timeline is twice the duration of the longest source. Automatic trimming can shorten the final result by removing an equal number of samples from both ends.

## This Max adaptation

This repository contains a Max/MSP implementation developed for Bryan Collins. It adds a rendered stereo output, visible generation and playback status, loop selection, automatic silence trimming, and 24-bit WAV export. It is an adaptation of Park’s APG, not a claim to the original idea or algorithm.

The original SuperCollider patch, standalone application, and bundled SuperCollider sound recordings are not included in this repository. The three `apgw_test*.wav` files are synthetic diagnostic sounds generated for this Max implementation.

## Terms and source material

Credit is separate from licensing. The original APG page’s request for credit is recorded here without assigning a new license to Park’s work or inventing additional permissions. Refer to the original project and its supplied files for any applicable terms.

The original project page was checked on November 20, 2026. The non-`www` address above was accessible at that time.
