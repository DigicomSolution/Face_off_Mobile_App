# To run this project:

`yarn install`

`yarn global add patch-package`

`patch -p1 -i patches/react-native+0.61.5.patch`

`npx patch-package react-native`

Above steps are for iOS 14. This patch fixes the image issue on iOS.


<!-- if Above commands not working
`node_modules > react-native > Libraries > Images > RCTUIImageViewAnimated.m` search for `if (_currentFrame)`

`if (_currentFrame) {`
   ` layer.contentsScale = self.animatedImageScale;`
    `layer.contents = (__bridge id)_currentFrame.CGImage;`
  `} else {`
   ` [super displayLayer:layer];`
  `}` -->



In ~/react-native-create-thumbnail/android/build.gradle change
`implementation 'commons-io:commons-io:+'`

to

`implementation 'commons-io:commons-io:2.8.0'`

Above steps are for create thumbnail after video capture
# DO NOT RUN THIS PROJECT WITH NPM