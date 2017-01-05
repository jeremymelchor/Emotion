import { async, TestBed } from '@angular/core/testing';
import { PostsComponent } from './posts.component';
describe('PostsComponent', function () {
    var component;
    var fixture;
    beforeEach(async(function () {
        TestBed.configureTestingModule({
            declarations: [PostsComponent]
        })
            .compileComponents();
    }));
    beforeEach(function () {
        fixture = TestBed.createComponent(PostsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', function () {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=C:/Users/Akme/WebstormProjects/test/mean-app/src/app/posts/posts.component.spec.js.map