/**
 * The script is part of SenkoJS.
 * 
 * AUTHOR:
 *  natade (http://twitter.com/natadea)
 * 
 * LICENSE:
 *  The MIT license https://opensource.org/licenses/MIT
 */

import S3Vector from "../math/S3Vector.js";

const S3MeshLoaderOBJ = {

	name : "OBJ",

	/**
	 * Wavefront OBJ形式で入力
	 * v 頂点
	 * vt テクスチャ
	 * vn テクスチャ 
	 * f 面
	 * @param {S3Mesh} mesh
	 * @param {String} text
	 * @returns {unresolved}
	 */
	input : function(sys, mesh, text, url) {
		
		const trim = function(str) {
			return(str.replace(/^\s+|\s+$/g, ""));
		};
		
		// 文字列解析
		const lines = text.split("\n");
		const v_list = [];
		const vt_list = [];
		const vn_list = [];
		const face_v_list = [];
		const face_vt_list = [];
		const face_vn_list = [];
		let material_count = 1;
		for(let i = 0; i < lines.length; i++) {
			// コメントより前の文字を取得
			const line = trim(lines[i].split("#")[0]);
			
			if(line.length === 0) {
				// 空白なら何もしない
				continue;
			}
			
			const data = line.split(" ");
			if(data[0] === "v") {
				// vertex
				const x = parseFloat(data[1]);
				const y = parseFloat(data[2]);
				const z = parseFloat(data[3]);
				const v = new S3Vector(x, y, z);
				v_list.push(v);
			}
			else if(data[0] === "vt") {
				// texture
				const u = parseFloat(data[1]);
				const v = parseFloat(data[2]);
				// 1より大きい場合は素材が違う
				const mat = Math.floor(v);
				const vt = new S3Vector(u, 1.0 - (v - mat)); // Vは反転させる
				vt_list.push([vt, mat]);
				if(material_count <= mat + 1) {
					material_count = mat + 1;
				}
			}
			else if(data[0] === "vn") {
				// normal
				const vn = new S3Vector(parseFloat(data[1]), parseFloat(data[2]), parseFloat(data[3]));
				vn_list.push(vn);
			}
			else if(data[0] === "f") {
				// face
				const vcount = data.length - 3; // 繰り返す回数
				const f1 = data[1];
				const f2 = data[2];
				const f3 = data[3];
				const f4 = vcount === 2 ? data[4] : 0;
				for(let j = 0;j < vcount; j++) {
					const fdata = [];
					if((j % 2) === 0) {
						fdata[2] = f1;
						fdata[1] = f2;
						fdata[0] = f3;
					}
					else {
						fdata[2] = f1;
						fdata[1] = f3;
						fdata[0] = f4;
					}
					const face_v = [];
					const face_vt = [];
					const face_vn = [];
					// 数字は1から始まるので、1を引く
					for(let k = 0;k < 3; k++) {
						const indexdata = fdata[k].split("/");
						if(indexdata.length === 1) {
							// 頂点インデックス
							face_v[k]	= parseInt(indexdata[0], 10) - 1;
						}
						else if(indexdata.length === 2) {
							// 頂点テクスチャ座標インデックス
							face_v[k]	= parseInt(indexdata[0], 10) - 1;
							face_vt[k]	= parseInt(indexdata[1], 10) - 1;
						}
						else if(indexdata.length === 3) {
							if(indexdata[1].length !== 0) {
								// 頂点法線インデックス
								face_v[k]	= parseInt(indexdata[0], 10) - 1;
								face_vt[k]	= parseInt(indexdata[1], 10) - 1;
								face_vn[k]	= parseInt(indexdata[2], 10) - 1;
							}
							else {
								// テクスチャ座標インデックス無しの頂点法線インデックス
								face_v[k]	= parseInt(indexdata[0], 10) - 1;
								face_vt[k]	= null;
								face_vn[k]	= parseInt(indexdata[2], 10) - 1;
							}
						}
					}
					face_v_list.push(face_v);
					face_vt_list.push(face_vt);
					face_vn_list.push(face_vn);
				}
			}
		}
		
		// 変換
		// マテリアルの保存
		for(let i = 0; i < material_count; i++) {
			const material = sys.createMaterial("" + i);
			mesh.addMaterial(material);
		}

		// 頂点の保存
		for(let i = 0; i < v_list.length; i++) {
			const vertex = sys.createVertex(v_list[i]);
			mesh.addVertex(vertex);
		}

		// インデックスの保存
		for(let i = 0; i < face_v_list.length; i++) {
			// UV情報から材質などを作成
			const vt_num = face_vt_list[i];
			let mat = 0;
			let uv = undefined;
			if(vt_num) {
				const uvm0 = vt_list[vt_num[0]];
				const uvm1 = vt_list[vt_num[1]];
				const uvm2 = vt_list[vt_num[2]];
				mat = uvm0[1];
				uv = [uvm0[0], uvm1[0], uvm2[0]];
			}
			// 追加
			const triangle = sys.createTriangleIndex(0, 1, 2, face_v_list[i], mat, uv);
			mesh.addTriangleIndex(triangle);
		}
		
		return true;
	}
};

export default S3MeshLoaderOBJ;
