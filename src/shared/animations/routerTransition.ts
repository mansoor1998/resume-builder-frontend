import { animate, animateChild, query, state, style, transition, trigger } from "@angular/animations";

export const fadeInAnimation = 
    // trigger name for attaching this animation to an element using the [@triggerName] syntax
    trigger('fadeInAnimation', [

        // the "in" style determines the "resting" state of the element when it is visible.
        state('in', style({opacity: 1})),
  
        // fade in when created. this could also be written as transition('void => *')
        transition(':enter', [
          style({opacity: 0}),
          animate(200)
        ]),
  
        // fade out when destroyed. this could also be written as transition('void => *')
        transition(':leave',
          animate(400, style({opacity: 0})))
      ])

    export const slideInOutAnimation =
    // trigger name for attaching this animation to an element using the [@triggerName] syntax
    trigger('slideInOutAnimation', [

        // end state styles for route container (host)
        state('*', style({
            // the view covers the whole screen with a semi tranparent background
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)'
        })),

        // route 'enter' transition
        transition(':enter', [

            // styles at start of transition
            style({
                // start with the content positioned off the right of the screen, 
                // -400% is required instead of -100% because the negative position adds to the width of the element
                right: '-400%',

                // start with background opacity set to 0 (invisible)
                backgroundColor: 'rgba(0, 0, 0, 0)'
            }),

            // animation and styles at end of transition
            animate('.5s ease-in-out', style({
                // transition the right position to 0 which slides the content into view
                right: 0,

                // transition the background opacity to 0.8 to fade it in
                backgroundColor: 'rgba(0, 0, 0, 0.8)'
            }))
        ]),

        // route 'leave' transition
        transition(':leave', [
            // animation and styles at end of transition
            animate('.5s ease-in-out', style({
                // transition the right position to -400% which slides the content out of view
                right: '-400%',

                // transition the background opacity to 0 to fade it out
                backgroundColor: 'rgba(0, 0, 0, 0)'
            }))
        ])
    ]);



const animationTimeFrame = 200;

export function fadeInOut() {
    return trigger( 'fadeInOut', [
        // animation transtion from one state (any name) to another state (any name)
        transition('* => *', [
            style({ position: 'relative' }),
            // current position of enter and leave state
            query(':enter, :leave', [
            style({
                position: 'absolute',
                top: 0,
                right: 0,
                width: '100%'
            })
            ], { optional: true }),
            // enter position starting with initial state from where it would animate
            query(':enter', [style({ opacity: 0 })], { optional: true }),
            
            // the leave state has started its animating process
            query(':leave', animateChild(), { optional: true }),
    
            // the leave state will animate to (  1.2 scale and fades away )
            query(':leave', [ animate(`${animationTimeFrame.toString()}ms ease`, style({ opacity: 0 }) ) ], { optional: true }),
    
            // query(':leave', [ animate(`0ms ease`, style({ opacity: 0 }) ) ], { optional: true }),

            // the enter state will animate to ( 1 scale and fade in ).
            query(':enter', [animate(`${animationTimeFrame.toString()}ms ease`, style({ opacity: 1 }))], { optional: true }),
    
            // the enter state has started animating. (Both leave and enter process are syncrhonous)
            query(':enter', animateChild(), { optional: true })
        ])
    ]);
}
      
