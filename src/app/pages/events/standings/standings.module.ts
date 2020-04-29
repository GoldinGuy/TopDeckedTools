import { IonicModule, ModalController } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { standingsPage } from "./standings";
// import { ParallaxCommonModule } from "../../common/parallax/parallax.module";
// import { PopoverViewComponentModule } from "../../component/popover-view/popover-view.module";
// import { PopoverViewComponent } from "../../component/popover-view/popover-view.component";

@NgModule({
	imports: [
		IonicModule,
		CommonModule,
		FormsModule,
		// ParallaxCommonModule,
		// PopoverViewComponentModule,
		RouterModule.forChild([{ path: "", component: standingsPage }])
	],
	// entryComponents: [advancedPage],
	declarations: [standingsPage],
	schemas: [CUSTOM_ELEMENTS_SCHEMA]
	// entryComponents: [PopoverViewComponent]
})
export class standingsPageModule {
	customPopoverOptions: any;
}
