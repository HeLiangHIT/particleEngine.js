Build particle engine using Javascript
======================================
今日看到一篇翻译过来的文章《用Javascript打造粒子引擎》，激动不已，随点击查看英文原文，一口气看完后续Part2，Part3作者正在更新，十分期待。
<hr>
什么是粒子系统？

> 粒子系统表示三维计算机图形学中模拟一些特定的模糊现象的技术，而这些现象用其它传统的渲染技术难以实现的真实感的game physics。经常使用粒子系统模拟的现象有火、爆炸、烟、水流、火花、落叶、云、雾、雪、尘、流星尾迹或者象发光轨迹这样的抽象视觉效果等等。

我们通过构建一个粒子引擎（Particle Engine）来实现粒子系统，从而给游戏注入活力和互动性，创建出几乎是无穷的效果。

如何用Javascript写出一个粒子引擎，这里就不废话了，看上面那片文章即可，作者一步一步带领你写引擎。本文的主要内容则是了解粒子引擎的整体架构。

## 粒子对象
<pre>
    //定义粒子对象
    var Particle=function(x,y,angle,speed,life,size,start_colour,colour_step){
        /* the particle's position */
        this.pos={
            x:x || 0,
            y:y || 0
        };
        /* set specified or default values */
        this.speed=speed || 5;
        this.life=life || 1;
        this.size=size || 2;
        this.lived=0;
        /* the particle's velocity */
        var radians=angle*Math.PI/180;
        this.vel={
            x:Math.cos(radians)*speed,
            y:-Math.sin(radians)*speed
        };
        /* the particle's colour values */
        this.colour=start_colour;
        this.colour_step=colour_step;
    };
</pre>
具体代码不看，每一个粒子引擎都需要定义一个粒子对象，其中至少要包含粒子的以下基本信息：

1. 位置
2. 大小
3. 速度
4. 运动方向
5. 生命周期

至于其他的属性可根据需要扩展。

## 发射器（Emitter，喷射器）
通常粒子系统在三维空间中的位置与运动是由发射器控制的。发射器主要由一组粒子行为参数以及在三维空间中的位置所表示。粒子行为参数可以包括粒子生成速度（即单位时间粒子生成的数目）、粒子初始速度向量（例如什么时候向什么方向运动）、粒子寿命（经过多长时间粒子湮灭）、粒子颜色、在粒子生命周期中的变化以及其它参数等等。使用大概值而不是绝对值的模糊参数占据全部或者绝大部分是很正常的，一些参数定义了中心值以及允许的变化。
<pre>
    //定义喷射器设置
    var settings={
        'basic':{
            'emission_rate':100,
            'min_life':2,
            'life_range':2,
            'min_angle':75,
            'angle_range':30,
            'min_speed':80,
            'speed_range':60,
            'min_size':2,
            'size_range':4,
            'colour':'#82c4f5',
            'start_colours':[
                [130,196,245,1],
                [69,152,212,1]
            ],
            'end_colours':[
                [130,196,245,0],
                [69,152,212,0]
            ],
            'gravity':{
                x:0,
                y:80
            },
            'min_position':{
                x:0,
                y:0
            },
            'position_range':{
                x:100,
                y:100
            }
        },
        .....
    }
</pre>
如同粒子对象一样，喷射器对象也必须具备一些属性：

1. 发射率
2. 生命周期
3. 发射角度
4. 发射速度
5. 位置
6. 其他。。

<pre>
    //定义喷射器
    var Emitter=function(x,y,settings){
        /* the emitter's position */
        this.pos={
            x:x,
            y:y
        };
        /* set specified values */
        this.settings=settings;
        /* How often the emitter needs to create a particle in milliseconds */
        this.emission_delay=1000/settings.emission_rate;
        // some codes...
        // blablablabla...
    };
</pre>
典型的粒子系统更新循环可以划分为两个不同的阶段：参数更新/模拟阶段以及渲染阶段。每个循环执行每一帧动画。

## 模拟阶段
在模拟阶段，根据生成速度以及更新间隔计算新粒子的数目，每个粒子根据发射器的位置及给定的生成区域在特定的三维空间位置生成，并且根据发射器的参数初始化每个粒子的速度、颜色、生命周期等等参数。然后检查每个粒子是否已经超出了生命周期，一旦超出就将这些粒子剔出模拟过程，否则就根据物理模拟更改粒子的位置与特性，这些物理模拟可能象将速度加到当前位置或者调整速度抵消摩擦这样简单，也可能象将外力考虑进取计算正确的物理抛射轨迹那样复杂。另外，经常需要检查与特殊三维物体的碰撞以使粒子从障碍物弹回。由于粒子之间的碰撞计算量很大并且对于大多数模拟来说没有必要，所以很少使用粒子之间的碰撞。
每个粒子系统都有用于其中每个粒子的特定规则，通常这些规则涉及到粒子生命周期的插值过程。例如，许多系统在粒子生命周期中对粒子的阿尔法值即透明性进行插值直到粒子湮灭。
<pre>
    //添加一个Update方法来管理粒子
    Emitter.prototype.update=function(){
        /* set the last_update variable to now if it's the first update */
        if(!this.last_update){
            this.last_update=Date.now();
            return;
        }

        /* some codes..... */
        // ...............

        /* check if we need to emit a new particle */
        if(this.last_emission>this.emission_delay){
            /* find out how many particles we need to emit */
            var i=Math.floor(this.last_emission/this.emission_delay);
            while(i--){
                // blablablabla...

                /* calculate the particle's properties based on the emitter's settings */
                this.particles.push(
                    new Particle(
                        // blablablabla...
                    )
                );
            }
        }

        /* loop through the existing particles */
        var i=this.particles.length;
        while(i--){
            var particle=this.particles[i];

            //对每个粒子的生命周期的处理
            /* skip if the particle is dead */
            if(particle.dead){
                /* remove the particle from th array */
                this.particles.splice(i,1);
                continue;
            }
            /* add the seconds passed to the particle's life */
            particle.lived+=dt;
            /* check if the particle should be dead */
            if(particle.lived>=particle.life){
                particle.dead=true;
                continue;
            }

            //更新位置
            /* calculate the particle's new position based on the seconds passed */
            particle.pos.x+=particle.vel.x*dt;
            particle.pos.y+=particle.vel.y*dt;

            /* draw th particle */
            ctx.fillStyle=this.settings.colour;

            // blablablabla...

            var x=this.pos.x+particle.pos.x;
            var y=this.pos.y+particle.pos.y;
            ctx.beginPath();
            ctx.arc(x,y,particle.size,0,Math.PI*2);
            ctx.fill();
        }
    }
</pre>
update方法整体来说结构如下：
记录时间差；
根据时间戳判断是否抛出（发射）新的粒子，此过程中完成对粒子的初始化；
接下来对每个现有存在的粒子判断生命周期，将过期的消灭掉；
最后对剩下的粒子进行位置，大小，颜色..等各种属性的更新。

## 渲染阶段
在更新完成之后，通常每个例子用经过纹理映射的四边形sprite进行渲染，也就是说四边形总是面向观察者。但是，这个过程不是必须的，在一些低分辨率或者处理能力有限的场合粒子可能仅仅渲染成一个像素，在离线渲染中甚至渲染成一个元球，从粒子元球计算出的等值面可以得到相当好的液体表面。另外，也可以用三维网格渲染粒子。

渲染代码部分在Part3，这个以后有待更新。
<pre>
    function loop(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        emitter.update();
        requestAnimFrame(loop);
    };
    loop();
</pre>
最后就是不断循环。

