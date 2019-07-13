This changelog follows Semantic Versioning https://semver.org/


# 3.0.0 (2019-07-13)

### Major

* Major lint changes, there are no functional changes but due to the massive
  amount of code changes this is being marked as a major bump for caution sake
  this will hopefully be the last of the changes like this for a while.

### Patch

* Fixed premature redirect in logOut and improved test coverage #20 @rwky
* Removed make-node and replaced with nyc and coveralls @rwky

# 2.1.1 (2019-04-30)

### Patch

* Added gitlab sast testing @rwky
* Updated npm dev deps @rwky
* Updated README and CONTRIBUTING to explain differences between passport and passport-next #13 @rwky
* Fixed monkey patch and memory leak #15 #9 @MayaWolf

# 2.1.0 (2018-11-03)

### Minor

* Exposed the method to customize the SessionManager object @adamhathcock

### Patch

* Added node 11 support @rwky
* Lint fixes @rwky
* Updated dev deps @rwky
* Added linting to travis @rwky

# 2.0.0 (2018-08-18)

### Major

* Added eslint configuration, and fixed a pletora of lint errors @idurotola
  This change should have been a patch (to 1.0.2) but because of the size of the
  number of lines changed it was made a major.

# 1.0.1 (2018-08-11)

### Patch

* Fixed premature redirect when using express sessions @zypA13510 @idurotola

# 1.0.0 (2018-09-06)

### Major

* Removed obsolete pauseStream option, streams as of node 0.10 are paused by default https://nodejs.org/api/stream.html#stream_two_modes @rwky

### Minor

* Updated dev deps @rwky

# 0.5.0 (2018-06-29)

### Minor

* Added CHANGELOG.md @rwky
* Updated travis to use node 6, 8 and 10 @rwky
* Updated dev deps @rwky
* Updated README.md and package.json for passport-next org @rwky
