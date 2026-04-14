import { Injectable, NgZone } from "@angular/core";
// ngzone is used to run code outside of Angular's change detection, 
// building momentum without triggering unnecessary UI updates
import { BehaviorSubject } from "rxjs";
// BehaviorSubject allows us to track momentum changes and reactively update components that subscribe to it
// like a scoreboard in a game, it keeps track of the current momentum value and notifies subscribers whenever it changes
// how it differs from a regular Subject is that it holds the latest value and emits it immediately to new subscribers, ensuring they always have the current momentum state when they subscribe
// pretty cool
@Injectable({
    providedIn: 'root'
})
export class MomentumService {
     sugarValue$ = new BehaviorSubject<number>(1.5);
    private target = 0;
    private spinDirection = 0;
    private velocity = 0;
    private requestAnimationFrameId: number | null = null;

    // physics constants
    private readonly ACCEL = 0.8;   // acceleration per frame
    private readonly FRICTION = 0.88;  // drag when released
    private readonly SPRING = 0.06;  // spring stiffness
    private readonly DAMPING = 0.75;  // oscillation damping
    constructor(private ngZone: NgZone) { }


    startSpin(direction: number){
        this.spinDirection = direction;
        if (!this.requestAnimationFrameId) {
            this.loop();
        }
    }

    stopSpin() {
        this.spinDirection = 0;

    }

    private loop() {
        this.ngZone.runOutsideAngular(() => {
            const update = () => {
                if (this.spinDirection !== 0) {
                    this.velocity += this.spinDirection * this.ACCEL;
                    this.target += this.spinDirection * 0.5; // increase target to create a sense of momentum
                } else {
                    // damp back to target when released
                    const spring = (this.target - this.sugarValue$.value) * this.SPRING;
                    this.velocity = (this.velocity + spring) * this.DAMPING;
                }

                const next = this.sugarValue$.value + this.velocity;
                this.ngZone.run(() => {
                    this.sugarValue$.next(next);
                });

                if(this.spinDirection !== 0 || Math.abs(this.velocity) > 0.01) {
                    this.requestAnimationFrameId = requestAnimationFrame(update); // continue the loop if still spinning or if there's still velocity
                } else {
                    this.requestAnimationFrameId = null; // stop the loop if not spinning and velocity is negligible
                }
            }
            this.requestAnimationFrameId = requestAnimationFrame(update);
        })
    }
}