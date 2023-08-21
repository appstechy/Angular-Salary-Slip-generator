// import { Injectable, ComponentFactoryResolver, ViewContainerRef } from '@angular/core';
// import { ProtectedPageComponent } from './protected-page/protected-page.component';
// import { HrProtectedPageComponent } from './hr-protected-page/hr-protected-page.component';

// @Injectable({
//   providedIn: 'root'
// })
// export class ComponentLoaderService {

//   constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

//   loadProtectedComponent(role: string, containerRef: ViewContainerRef) {
//     containerRef.clear();
//     const componentToLoad =
//       role === 'admin' ? HrProtectedPageComponent : ProtectedPageComponent;

//     const componentFactory = this.componentFactoryResolver.resolveComponentFactory(
//       componentToLoad
//     );
//     containerRef.createComponent(componentFactory);
//   }
// }
